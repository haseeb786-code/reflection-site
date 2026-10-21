#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load .env
function loadEnv() {
  const envPath = path.join(rootDir, ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const WP_SITE = (process.env.WP_SITE_URL || "https://optimistic-candy.wordpress.com").replace(/\/+$/, "");
const WP_USER = process.env.WP_USERNAME || "";
const WP_PASS = (process.env.WP_APPLICATION_PASSWORD || "").replace(/\s+/g, "");
const WP_TOKEN = process.env.WP_TOKEN || "";

function getEndpoint(path) {
  try {
    const parsed = new URL(WP_SITE);
    if (parsed.hostname.endsWith(".wordpress.com")) {
      return `https://public-api.wordpress.com/wp/v2/sites/${parsed.hostname}${path}`;
    }
  } catch (e) {}
  return `${WP_SITE}/wp-json/wp/v2${path}`;
}

function getHeaders(contentType = "application/json") {
  const headers = { "Accept": "application/json" };
  if (contentType) headers["Content-Type"] = contentType;

  if (WP_TOKEN) {
    headers["Authorization"] = `Bearer ${WP_TOKEN}`;
  } else if (WP_USER && WP_PASS) {
    const creds = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
    headers["Authorization"] = `Basic ${creds}`;
  }
  return headers;
}

async function testConnection() {
  console.log(`\n--- Testing Connection to: ${WP_SITE} ---`);
  const endpoint = getEndpoint("/posts?per_page=1");
  console.log(`Endpoint: ${endpoint}`);

  if (WP_USER && WP_PASS) {
    console.log(`Authentication: Basic Auth (User: ${WP_USER})`);
  } else if (WP_TOKEN) {
    console.log(`Authentication: Bearer Token`);
  } else {
    console.log(`Authentication: None (Public Read-Only)`);
  }

  try {
    const res = await fetch(endpoint, { headers: getHeaders() });
    if (!res.ok) {
      console.error(`HTTP Error: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error(`Response: ${text}`);
      return;
    }
    const data = await res.json();
    console.log(`[SUCCESS] Connected! Found ${data.length} post(s).`);
    if (data[0]) {
      console.log(`Sample Post: "${data[0].title?.rendered}" (${data[0].link})`);
    }

    if ((WP_USER && WP_PASS) || WP_TOKEN) {
      const userRes = await fetch(getEndpoint("/users/me"), { headers: getHeaders() });
      if (userRes.ok) {
        const user = await userRes.json();
        console.log(`[AUTH SUCCESS] Logged in as: ${user.name} (Role: ${user.roles?.join(", ")})`);
      } else {
        console.warn(`[AUTH WARNING] Could not verify /users/me (${userRes.status}). Check Application Password.`);
      }
    }
  } catch (err) {
    console.error(`Connection failed:`, err.message);
  }
}

async function listPosts() {
  console.log(`\n--- Listing Recent Posts ---`);
  const endpoint = getEndpoint("/posts?per_page=10");
  const res = await fetch(endpoint, { headers: getHeaders() });
  const posts = await res.json();
  if (Array.isArray(posts)) {
    posts.forEach((p, idx) => {
      console.log(`${idx + 1}. [${p.status.toUpperCase()}] ${p.title?.rendered} (ID: ${p.id})`);
      console.log(`   Link: ${p.link}`);
    });
  } else {
    console.log(posts);
  }
}

async function uploadMedia(filePath, alt = "") {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
  };
  const mime = mimeTypes[ext] || "application/octet-stream";

  const endpoint = getEndpoint("/media");
  const headers = getHeaders(null);
  headers["Content-Disposition"] = `attachment; filename="${fileName}"`;
  headers["Content-Type"] = mime;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: fileBuffer
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed (${res.status}): ${errorText}`);
  }

  const media = await res.json();
  return media;
}

async function uploadAllImages() {
  console.log(`\n--- Uploading 27 Mirror Images to WordPress ---`);
  const imagesDir = path.join(rootDir, "assets", "images");
  const files = fs.readdirSync(imagesDir);

  let successCount = 0;
  for (const file of files) {
    const fullPath = path.join(imagesDir, file);
    try {
      process.stdout.write(`Uploading ${file}... `);
      const media = await uploadMedia(fullPath, file.replace(/[-_.]/g, " "));
      console.log(`DONE (ID: ${media.id})`);
      successCount++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
  console.log(`\nFinished: ${successCount}/${files.length} images uploaded.`);
}

// Command dispatcher
const action = process.argv[2] || "test";
switch (action) {
  case "test":
    await testConnection();
    break;
  case "list-posts":
    await listPosts();
    break;
  case "upload-images":
    await uploadAllImages();
    break;
  default:
    console.log(`Usage: node scripts/wp_agent.js [test | list-posts | upload-images]`);
}
