import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ADMIN_URL = 'https://reflectionelite.ataanalytiq.com/wp-admin';
const SITE_URL = 'https://reflectionelite.ataanalytiq.com';
const USERNAME = 'reflectionelite';
const PASSWORD = 'process.env.PROD_WP_PASS || ""';

async function audit() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Step 1: Login
  console.log('Navigating to login page:', ADMIN_URL);
  await page.goto(ADMIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('Current URL:', page.url());

  const userInput = await page.$('#user_login');
  if (userInput) {
    console.log('Entering credentials...');
    await page.type('#user_login', USERNAME);
    await page.type('#user_pass', PASSWORD);
    console.log('Clicking submit...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
      page.click('#wp-submit')
    ]);
    console.log('Post-login URL:', page.url());
    console.log('Post-login Title:', await page.title());
  } else {
    console.log('No login form found, maybe already logged in or redirected:', page.url());
  }

  // Check if login error exists
  const loginError = await page.$('#login_error');
  if (loginError) {
    const errorText = await page.evaluate(el => el.innerText, loginError);
    console.error('LOGIN FAILED:', errorText);
    await page.screenshot({ path: 'login_error.png' });
    await browser.close();
    return;
  }

  // 1. Check Active Themes
  console.log('\n--- Checking Active Theme ---');
  await page.goto(`${ADMIN_URL}/themes.php`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const themeData = await page.evaluate(() => {
    const activeTheme = document.querySelector('.theme.active');
    if (activeTheme) {
      const name = activeTheme.querySelector('.theme-name')?.innerText;
      const version = activeTheme.querySelector('.theme-version')?.innerText;
      const author = activeTheme.querySelector('.theme-author')?.innerText;
      return { name, version, author, text: activeTheme.innerText };
    }
    return { error: 'No active theme container found' };
  });
  console.log('Active Theme:', JSON.stringify(themeData, null, 2));

  // 2. Check Installed & Active Plugins
  console.log('\n--- Checking Active Plugins ---');
  await page.goto(`${ADMIN_URL}/plugins.php`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const pluginsData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr.active'));
    return rows.map(r => {
      const name = r.querySelector('.plugin-title strong')?.innerText || '';
      const desc = r.querySelector('.desc p')?.innerText || '';
      const version = r.querySelector('.plugin-version-author-uri')?.innerText || '';
      return { name, version, desc };
    });
  });
  console.log(`Active Plugins (${pluginsData.length}):`, JSON.stringify(pluginsData, null, 2));

  // Check all plugins (inactive too, e.g., staging plugins)
  const allPlugins = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table.plugins tr[data-slug]'));
    return rows.map(r => ({
      slug: r.getAttribute('data-slug'),
      isActive: r.classList.contains('active'),
      title: r.querySelector('.plugin-title strong')?.innerText || ''
    }));
  });
  console.log('All Installed Plugins:', JSON.stringify(allPlugins, null, 2));

  // 3. Check Pages / Front Page Setting
  console.log('\n--- Checking Reading Settings (Front Page) ---');
  await page.goto(`${ADMIN_URL}/options-reading.php`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const readingSettings = await page.evaluate(() => {
    const frontPageRadio = document.querySelector('input[name="show_on_front"]:checked')?.value;
    const pageOnFront = document.querySelector('select[name="page_on_front"] option:checked')?.text;
    const pageOnFrontVal = document.querySelector('select[name="page_on_front"] option:checked')?.value;
    return { frontPageRadio, pageOnFront, pageOnFrontVal };
  });
  console.log('Reading Settings:', JSON.stringify(readingSettings, null, 2));

  // Check Pages list
  console.log('\n--- Checking Pages List ---');
  await page.goto(`${ADMIN_URL}/edit.php?post_type=page`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const pagesList = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#the-list tr'));
    return rows.map(r => {
      const titleEl = r.querySelector('.row-title');
      const title = titleEl?.innerText;
      const href = titleEl?.getAttribute('href');
      const state = r.querySelector('.post-state')?.innerText || '';
      return { title, href, state };
    });
  });
  console.log('Pages:', JSON.stringify(pagesList, null, 2));

  // 4. Inspect Live Homepage Structure & Fonts
  console.log('\n--- Inspecting Live Homepage ---');
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.screenshot({ path: 'audit_step1_live_homepage.png', fullPage: true });

  const homepageAnalysis = await page.evaluate(() => {
    // Collect all loaded stylesheets / font links
    const fontLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"]'))
      .map(l => l.href)
      .filter(href => href.includes('font') || href.includes('fonts.googleapis.com') || href.includes('typekit'));

    // Get fonts on key elements
    const getFont = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const comp = window.getComputedStyle(el);
      return {
        selector: sel,
        fontFamily: comp.fontFamily,
        fontSize: comp.fontSize,
        fontWeight: comp.fontWeight,
        color: comp.color,
        sampleText: el.innerText.trim().slice(0, 60)
      };
    };

    const typography = {
      body: getFont('body'),
      h1: getFont('h1'),
      h2: getFont('h2'),
      h3: getFont('h3'),
      nav: getFont('header nav') || getFont('.main-navigation') || getFont('header a') || getFont('nav a'),
      buttons: getFont('button') || getFont('.btn') || getFont('.button') || getFont('a.button')
    };

    // Extract section structure of the homepage
    const sections = [];
    const mainEl = document.querySelector('main') || document.querySelector('#content') || document.querySelector('.site-main') || document.body;
    
    // Check direct children or major containers
    const elements = Array.from(mainEl.children);
    elements.forEach((child, index) => {
      // Find headings inside
      const headings = Array.from(child.querySelectorAll('h1, h2, h3, h4')).map(h => `${h.tagName}: ${h.innerText.trim()}`);
      sections.push({
        index: index + 1,
        tagName: child.tagName,
        id: child.id,
        className: child.className,
        headings: headings.slice(0, 5),
        snippet: child.innerText.trim().slice(0, 150).replace(/\s+/g, ' ')
      });
    });

    return {
      title: document.title,
      fontLinks,
      typography,
      sections
    };
  });

  console.log('Homepage Analysis:', JSON.stringify(homepageAnalysis, null, 2));

  // Save full audit data to JSON
  fs.writeFileSync('audit_step1_report.json', JSON.stringify({
    themeData,
    readingSettings,
    pagesList,
    pluginsData,
    allPlugins,
    homepageAnalysis
  }, null, 2));

  console.log('\nAudit complete! Saved to audit_step1_report.json and audit_step1_live_homepage.png');

  await browser.close();
}

audit().catch(console.error);
