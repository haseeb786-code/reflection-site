#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Helper to load .env file manually if present
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), ".env"),
    path.join(projectRoot, ".env")
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
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
      } catch (err) {
        console.error("Warning: could not parse .env file:", err.message);
      }
    }
  }
}

loadEnv();

// Configuration resolver
function getWpConfig(overrides = {}) {
  const siteUrl = (overrides.site_url || process.env.WP_SITE_URL || "https://optimistic-candy.wordpress.com").replace(/\/+$/, "");
  const username = overrides.username || process.env.WP_USERNAME || "";
  const appPassword = overrides.app_password || process.env.WP_APPLICATION_PASSWORD || "";
  const token = overrides.token || process.env.WP_TOKEN || "";

  return { siteUrl, username, appPassword, token };
}

// Build API Endpoint URL for both WordPress.com and standard WP sites
function buildApiUrl(siteUrl, endpointPath) {
  const cleanPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  try {
    const parsed = new URL(siteUrl);
    if (parsed.hostname.endsWith(".wordpress.com")) {
      return `https://public-api.wordpress.com/wp/v2/sites/${parsed.hostname}${cleanPath}`;
    }
  } catch (e) {
    // fallback
  }
  return `${siteUrl}/wp-json/wp/v2${cleanPath}`;
}

// Build Authentication Headers
function buildAuthHeaders(config) {
  const headers = {};
  if (config.token) {
    headers["Authorization"] = `Bearer ${config.token.trim()}`;
  } else if (config.username && config.appPassword) {
    const cleanPw = config.appPassword.replace(/\s+/g, "");
    const base64Auth = Buffer.from(`${config.username.trim()}:${cleanPw}`).toString("base64");
    headers["Authorization"] = `Basic ${base64Auth}`;
  }
  return headers;
}

// Generic WP REST API requester
async function wpFetch(config, endpointPath, options = {}) {
  const url = buildApiUrl(config.siteUrl, endpointPath);
  const authHeaders = buildAuthHeaders(config);

  const headers = {
    ...authHeaders,
    "Accept": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body
  });

  const contentType = response.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = typeof data === "object" ? (data.message || JSON.stringify(data)) : data;
    throw new Error(`WordPress API Error [${response.status}]: ${errorMsg}`);
  }

  return data;
}

// Initialize the MCP Server
const server = new McpServer({
  name: "wordpress-agent",
  version: "1.0.0"
});

// Tool 1: Test Connection & Get Site/User Info
server.tool(
  "wp_test_connection",
  "Check WordPress connectivity and verify user credentials.",
  {
    site_url: z.string().optional().describe("WordPress site URL (e.g. https://optimistic-candy.wordpress.com)"),
    username: z.string().optional().describe("WordPress username (if testing auth)"),
    app_password: z.string().optional().describe("Application Password (if testing auth)"),
    token: z.string().optional().describe("WordPress.com Bearer Token (if testing auth)")
  },
  async (args) => {
    try {
      const config = getWpConfig(args);
      let userInfo = null;
      let authStatus = "Unauthenticated (Public Read Only)";

      if ((config.username && config.appPassword) || config.token) {
        try {
          userInfo = await wpFetch(config, "/users/me");
          authStatus = `Authenticated as: ${userInfo.name} (@${userInfo.slug || userInfo.id})`;
        } catch (authErr) {
          authStatus = `Authentication Failed: ${authErr.message}`;
        }
      }

      // Fetch public posts count/list to verify connection
      const posts = await wpFetch(config, "/posts?per_page=1");

      const result = {
        site_url: config.siteUrl,
        api_endpoint: buildApiUrl(config.siteUrl, "/posts"),
        auth_status: authStatus,
        user: userInfo ? { id: userInfo.id, name: userInfo.name, roles: userInfo.roles } : null,
        status: "Connected successfully",
        recent_post_check: posts.length > 0 ? `Found recent post: "${posts[0].title?.rendered || posts[0].slug}"` : "Site connected, no posts found"
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error connecting to WordPress: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 2: List Posts
server.tool(
  "wp_list_posts",
  "List posts from WordPress with status, title, URL, and dates.",
  {
    status: z.enum(["publish", "draft", "future", "pending", "private", "any"]).optional().default("publish").describe("Post status"),
    per_page: z.number().min(1).max(100).optional().default(10).describe("Number of posts to return"),
    search: z.string().optional().describe("Search term")
  },
  async (args) => {
    try {
      const config = getWpConfig();
      const params = new URLSearchParams({
        per_page: String(args.per_page),
        status: args.status
      });
      if (args.search) params.append("search", args.search);

      const posts = await wpFetch(config, `/posts?${params.toString()}`);
      const summary = posts.map(p => ({
        id: p.id,
        title: p.title?.rendered,
        slug: p.slug,
        status: p.status,
        date: p.date,
        link: p.link,
        featured_media: p.featured_media
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to list posts: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 3: Get Post by ID
server.tool(
  "wp_get_post",
  "Retrieve complete details of a specific WordPress post.",
  {
    id: z.number().describe("Post ID")
  },
  async ({ id }) => {
    try {
      const config = getWpConfig();
      const post = await wpFetch(config, `/posts/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(post, null, 2) }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to get post #${id}: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 4: Create Post
server.tool(
  "wp_create_post",
  "Create a new blog post on WordPress.",
  {
    title: z.string().describe("Post title"),
    content: z.string().describe("Post HTML or block content"),
    status: z.enum(["publish", "draft", "pending", "private"]).optional().default("draft").describe("Publishing status"),
    excerpt: z.string().optional().describe("Short excerpt/summary"),
    categories: z.array(z.number()).optional().describe("List of category IDs"),
    tags: z.array(z.number()).optional().describe("List of tag IDs"),
    featured_media_id: z.number().optional().describe("Featured image media ID")
  },
  async (args) => {
    try {
      const config = getWpConfig();
      const body = {
        title: args.title,
        content: args.content,
        status: args.status,
        ...(args.excerpt ? { excerpt: args.excerpt } : {}),
        ...(args.categories ? { categories: args.categories } : {}),
        ...(args.tags ? { tags: args.tags } : {}),
        ...(args.featured_media_id ? { featured_media: args.featured_media_id } : {})
      };

      const result = await wpFetch(config, "/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      return {
        content: [{
          type: "text",
          text: `Post created successfully!\nID: ${result.id}\nTitle: ${result.title?.rendered}\nStatus: ${result.status}\nLink: ${result.link}`
        }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to create post: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 5: Create or Update Page
server.tool(
  "wp_create_page",
  "Create a static page (e.g. About Us, Contact, Catalog) on WordPress.",
  {
    title: z.string().describe("Page title"),
    content: z.string().describe("Page HTML content"),
    status: z.enum(["publish", "draft", "pending", "private"]).optional().default("publish").describe("Publishing status"),
    slug: z.string().optional().describe("Custom URL slug")
  },
  async (args) => {
    try {
      const config = getWpConfig();
      const body = {
        title: args.title,
        content: args.content,
        status: args.status,
        ...(args.slug ? { slug: args.slug } : {})
      };

      const result = await wpFetch(config, "/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      return {
        content: [{
          type: "text",
          text: `Page created successfully!\nID: ${result.id}\nTitle: ${result.title?.rendered}\nStatus: ${result.status}\nLink: ${result.link}`
        }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to create page: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 6: Upload Media File (Images, etc.)
server.tool(
  "wp_upload_media",
  "Upload an image from the local filesystem to the WordPress Media Library.",
  {
    file_path: z.string().describe("Path to local image file (e.g., assets/images/antique-venetian-cushion-1.webp)"),
    title: z.string().optional().describe("Image title"),
    alt_text: z.string().optional().describe("Alternative text for accessibility & SEO"),
    caption: z.string().optional().describe("Image caption")
  },
  async (args) => {
    try {
      const config = getWpConfig();
      let resolvedPath = args.file_path;
      if (!path.isAbsolute(resolvedPath)) {
        resolvedPath = path.resolve(projectRoot, resolvedPath);
      }

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File not found at: ${resolvedPath}`);
      }

      const fileBuffer = fs.readFileSync(resolvedPath);
      const fileName = path.basename(resolvedPath);
      const ext = path.extname(resolvedPath).toLowerCase();

      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml"
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      const url = buildApiUrl(config.siteUrl, "/media");
      const authHeaders = buildAuthHeaders(config);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": contentType
        },
        body: fileBuffer
      });

      const media = await response.json();
      if (!response.ok) {
        throw new Error(media.message || `Upload failed with status ${response.status}`);
      }

      // If alt_text or title provided, update metadata
      if (args.title || args.alt_text || args.caption) {
        try {
          await wpFetch(config, `/media/${media.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(args.title ? { title: args.title } : {}),
              ...(args.alt_text ? { alt_text: args.alt_text } : {}),
              ...(args.caption ? { caption: args.caption } : {})
            })
          });
        } catch (e) {
          // ignore metadata update failure if initial upload succeeded
        }
      }

      return {
        content: [{
          type: "text",
          text: `Media uploaded successfully!\nID: ${media.id}\nSource URL: ${media.source_url}\nFilename: ${fileName}`
        }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to upload media: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 7: List Categories
server.tool(
  "wp_list_categories",
  "List post categories on WordPress.",
  {
    per_page: z.number().min(1).max(100).optional().default(50).describe("Categories per page")
  },
  async ({ per_page }) => {
    try {
      const config = getWpConfig();
      const categories = await wpFetch(config, `/categories?per_page=${per_page}`);
      const summary = categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c.count
      }));
      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to list categories: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 8: Create Category
server.tool(
  "wp_create_category",
  "Create a new category in WordPress.",
  {
    name: z.string().describe("Category Name"),
    description: z.string().optional().describe("Category Description"),
    slug: z.string().optional().describe("Category Slug")
  },
  async (args) => {
    try {
      const config = getWpConfig();
      const result = await wpFetch(config, "/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args)
      });
      return {
        content: [{
          type: "text",
          text: `Category created!\nID: ${result.id}\nName: ${result.name}\nSlug: ${result.slug}`
        }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to create category: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Tool 9: Import Reflection Elite Shopify Product as Showcase Post
server.tool(
  "wp_import_shopify_product",
  "Publish a Reflection Elite mirror product from shopify_export.json as a WordPress showcase post.",
  {
    product_title_or_handle: z.string().describe("Handle or partial title of the Shopify product to publish (e.g. 'antique-venetian-cushion-mirror')"),
    status: z.enum(["publish", "draft"]).optional().default("publish").describe("Post status")
  },
  async ({ product_title_or_handle, status }) => {
    try {
      const config = getWpConfig();
      const exportPath = path.join(projectRoot, "data", "shopify_export.json");
      if (!fs.existsSync(exportPath)) {
        throw new Error("data/shopify_export.json not found in workspace!");
      }

      const shopifyData = JSON.parse(fs.readFileSync(exportPath, "utf8"));
      const query = product_title_or_handle.toLowerCase();
      const product = shopifyData.products.find(p =>
        p.handle.toLowerCase().includes(query) || p.title.toLowerCase().includes(query)
      );

      if (!product) {
        throw new Error(`Product matching "${product_title_or_handle}" not found in shopify_export.json`);
      }

      // Format rich HTML showcase
      const priceFormatted = (product.variants && product.variants[0])
        ? `₹${parseFloat(product.variants[0].price).toLocaleString("en-IN")}`
        : "Contact for pricing";

      let variantsHtml = "";
      if (product.variants && product.variants.length > 1) {
        variantsHtml = `
          <h3>Available Options & Variants</h3>
          <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;margin-bottom:20px;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th>Variant / Size</th>
                <th>SKU</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${product.variants.map(v => `
                <tr>
                  <td>${v.title}</td>
                  <td>${v.sku || "N/A"}</td>
                  <td>₹${parseFloat(v.price).toLocaleString("en-IN")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `;
      }

      const content = `
        <div class="reflection-elite-product-showcase" style="font-family:sans-serif;line-height:1.6;">
          <div style="background:#fafafa;padding:15px;border-left:4px solid #b8860b;margin-bottom:20px;">
            <p style="font-size:1.3em;font-weight:bold;margin:0 0 5px 0;">Price: ${priceFormatted}</p>
            <p style="margin:0;color:#666;">Type: ${product.product_type || "Luxury Mirror"} | Vendor: ${product.vendor || "Reflection Elite"}</p>
          </div>
          
          <div class="product-description">
            ${product.body_html || "<p>Luxury handcrafted mirror by Reflection Elite.</p>"}
          </div>

          ${variantsHtml}

          <div style="margin-top:25px;padding:15px;background:#f0f8ff;border-radius:4px;">
            <p style="margin:0;font-weight:bold;">✨ Handcrafted by Reflection Elite</p>
            <p style="margin:5px 0 0 0;font-size:0.9em;color:#555;">High-definition mirror glass with bespoke craftsmanship.</p>
          </div>
        </div>
      `;

      const result = await wpFetch(config, "/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          content: content,
          status: status,
          excerpt: `Luxury Mirror - ${product.title}. Price: ${priceFormatted}. Handcrafted by Reflection Elite.`
        })
      });

      return {
        content: [{
          type: "text",
          text: `Product "${product.title}" published successfully to WordPress!\nPost ID: ${result.id}\nStatus: ${result.status}\nLink: ${result.link}`
        }]
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to import product: ${err.message}` }],
        isError: true
      };
    }
  }
);

// Start the server using stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WordPress MCP Server running over stdio");
}

main().catch((err) => {
  console.error("Fatal error starting WordPress MCP Server:", err);
  process.exit(1);
});
