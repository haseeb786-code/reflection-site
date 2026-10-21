import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ADMIN_URL = 'https://reflectionelite.ataanalytiq.com/wp-admin';
const SITE_URL = 'https://reflectionelite.ataanalytiq.com';
const USERNAME = 'reflectionelite';
const PASSWORD = 'process.env.PROD_WP_PASS || ""';
const COOKIES_PATH = './wp_session_cookies.json';

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,900'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  await page.evaluateOnNewDocument(() => {
    delete Object.getPrototypeOf(navigator).webdriver;
  });

  // Check if saved cookies exist
  let loggedIn = false;
  if (fs.existsSync(COOKIES_PATH)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf8'));
      await page.setCookie(...cookies);
      await page.goto(ADMIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (page.url().includes('wp-admin') && !page.url().includes('wp-login.php')) {
        console.log('Logged in via existing session cookies!');
        loggedIn = true;
      }
    } catch (e) {
      console.log('Cookie restoration note:', e.message);
    }
  }

  if (!loggedIn) {
    console.log('Performing login to wp-admin...');
    await page.goto(ADMIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (page.url().includes('wp-login.php')) {
      await page.waitForSelector('#user_login', { timeout: 10000 });
      await page.type('#user_login', USERNAME, { delay: 20 });
      await page.type('#user_pass', PASSWORD, { delay: 20 });
      if (await page.$('#rememberme')) {
        await page.click('#rememberme');
      }
      console.log('Submitting login form...');
      await page.click('#wp-submit');
      console.log('Waiting for dashboard redirection...');
      await page.waitForFunction(() => !window.location.href.includes('wp-login.php') && window.location.href.includes('wp-admin'), { timeout: 30000 });
      console.log('Successfully arrived at:', page.url());
      await page.screenshot({ path: 'audit_step1_dashboard.png' });
    }
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log('Saved cookies to', COOKIES_PATH);
  }

  const results = {};

  // 1. Audit Active Theme
  console.log('\n--- 1. Auditing Active Theme ---');
  await page.goto(`${ADMIN_URL}/themes.php`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  results.themes = await page.evaluate(() => {
    const active = document.querySelector('.theme.active');
    const all = Array.from(document.querySelectorAll('.theme')).map(t => ({
      name: t.querySelector('.theme-name')?.innerText?.trim(),
      isActive: t.classList.contains('active'),
      id: t.getAttribute('data-slug')
    }));
    return {
      activeThemeName: active?.querySelector('.theme-name')?.innerText?.trim(),
      activeThemeVersion: active?.querySelector('.theme-version')?.innerText?.trim(),
      activeThemeAuthor: active?.querySelector('.theme-author')?.innerText?.trim(),
      allThemes: all
    };
  });
  console.log('Theme info:', results.themes);

  // 2. Audit Plugins (Detect Page Builder & Staging tools)
  console.log('\n--- 2. Auditing Plugins & Page Builder & Staging ---');
  await page.goto(`${ADMIN_URL}/plugins.php`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  results.plugins = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table.plugins tr[data-slug]'));
    return rows.map(r => {
      const slug = r.getAttribute('data-slug');
      const title = r.querySelector('.plugin-title strong')?.innerText?.trim();
      const desc = r.querySelector('.desc p')?.innerText?.trim();
      const version = r.querySelector('.plugin-version-author-uri')?.innerText?.trim();
      const isActive = r.classList.contains('active');
      return { slug, title, isActive, version, desc };
    });
  });

  const activePlugins = results.plugins.filter(p => p.isActive);
  console.log('Active plugins count:', activePlugins.length);
  activePlugins.forEach(p => console.log(` - [ACTIVE] ${p.title} (${p.slug})`));

  // Identify page builders
  const knownBuilders = ['elementor', 'divi-builder', 'js_composer', 'beaver-builder', 'siteorigin-panels', 'brizy', 'oxygen', 'bricks', 'gutenberg'];
  const detectedBuilders = results.plugins.filter(p => knownBuilders.some(b => p.slug?.toLowerCase().includes(b) || p.title?.toLowerCase().includes(b)));
  console.log('Detected page builder plugins:', detectedBuilders);

  // Identify staging plugins or tools
  const stagingPlugins = results.plugins.filter(p => p.slug?.toLowerCase().includes('staging') || p.slug?.toLowerCase().includes('duplicate') || p.slug?.toLowerCase().includes('clone') || p.title?.toLowerCase().includes('staging') || p.title?.toLowerCase().includes('duplicate'));
  console.log('Detected staging/duplicate plugins:', stagingPlugins);

  // 3. Audit Reading Settings (Front Page ID)
  console.log('\n--- 3. Auditing Front Page ID & Reading Settings ---');
  await page.goto(`${ADMIN_URL}/options-reading.php`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  results.readingSettings = await page.evaluate(() => {
    const showOnFront = document.querySelector('input[name="show_on_front"]:checked')?.value;
    const pageOnFrontSelect = document.querySelector('select[name="page_on_front"]');
    const selectedOption = pageOnFrontSelect?.querySelector('option:checked');
    return {
      showOnFront, // 'page' or 'posts'
      pageOnFrontId: selectedOption?.value,
      pageOnFrontTitle: selectedOption?.text
    };
  });
  console.log('Reading settings:', results.readingSettings);

  // 4. Audit Pages List (Check if any draft / staging / clone page exists)
  console.log('\n--- 4. Auditing Pages List ---');
  await page.goto(`${ADMIN_URL}/edit.php?post_type=page`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  results.pages = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#the-list tr'));
    return rows.map(r => {
      const titleLink = r.querySelector('.row-title');
      const title = titleLink?.innerText?.trim();
      const editHref = titleLink?.getAttribute('href');
      const postState = r.querySelector('.post-state')?.innerText?.trim() || '';
      const date = r.querySelector('.column-date')?.innerText?.trim() || '';
      return { title, editHref, postState, date };
    });
  });
  console.log('Pages list:', results.pages);

  // If there is a front page, check how it is edited (Gutenberg vs Elementor etc)
  if (results.readingSettings.pageOnFrontId) {
    console.log(`\n--- Inspecting Front Page edit screen (ID: ${results.readingSettings.pageOnFrontId}) ---`);
    await page.goto(`${ADMIN_URL}/post.php?post=${results.readingSettings.pageOnFrontId}&action=edit`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    const editorType = await page.evaluate(() => {
      const isElementor = !!document.querySelector('#elementor-switch-mode') || !!document.querySelector('.elementor-editor-active');
      const isBlockEditor = document.body.classList.contains('block-editor-page') || !!document.querySelector('.block-editor-writing-flow');
      const isClassic = !!document.querySelector('#postdivrich');
      return { isElementor, isBlockEditor, isClassic, bodyClasses: document.body.className };
    });
    results.homepageEditorType = editorType;
    console.log('Homepage editor type:', editorType);
  }

  // 5. Audit Live Homepage Structure & Typography
  console.log('\n--- 5. Auditing Live Homepage Layout & Fonts ---');
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'audit_step1_live_homepage.png', fullPage: true });

  results.homepage = await page.evaluate(() => {
    // 1. All font links / Google fonts
    const fontLinks = Array.from(document.querySelectorAll('link[href*="font"], link[href*="typekit"], style'))
      .map(el => el.href || el.textContent)
      .filter(Boolean);

    // 2. Computed typography
    const getElStyle = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const comp = window.getComputedStyle(el);
      return {
        selector: sel,
        fontFamily: comp.fontFamily,
        fontSize: comp.fontSize,
        fontWeight: comp.fontWeight,
        lineHeight: comp.lineHeight,
        color: comp.color,
        sampleText: el.innerText.trim().slice(0, 80).replace(/\s+/g, ' ')
      };
    };

    const typography = {
      body: getElStyle('body'),
      h1: getElStyle('h1'),
      h2: getElStyle('h2'),
      h3: getElStyle('h3'),
      h4: getElStyle('h4'),
      navigation: getElStyle('.nav-menu a, .menu a, header nav a, header a, .main-navigation a, nav a'),
      headerLogo: getElStyle('.site-title, .custom-logo-link, header .logo'),
      button: getElStyle('.button, .btn, input[type="submit"], a.btn')
    };

    // 3. Sections breakdown (Header, Main, Footer, and all top-level sections)
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main') || document.querySelector('#content') || document.querySelector('.site-content') || document.body;

    const sections = [];
    const children = Array.from(main.children);
    children.forEach((child, i) => {
      // Find all headings inside
      const headings = Array.from(child.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => `${h.tagName}: ${h.innerText.trim()}`);
      // Find images
      const imagesCount = child.querySelectorAll('img').length;
      // Find buttons/links
      const linksCount = child.querySelectorAll('a').length;

      sections.push({
        index: i + 1,
        tagName: child.tagName,
        id: child.id,
        className: child.className,
        headings,
        imagesCount,
        linksCount,
        textPreview: child.innerText.trim().slice(0, 150).replace(/\s+/g, ' ')
      });
    });

    return {
      title: document.title,
      headerText: header ? header.innerText.trim().replace(/\s+/g, ' ').slice(0, 200) : null,
      footerText: footer ? footer.innerText.trim().replace(/\s+/g, ' ').slice(0, 200) : null,
      typography,
      sections
    };
  });

  // Save audit report
  fs.writeFileSync('audit_step1_data.json', JSON.stringify(results, null, 2));
  console.log('\nAudit finished successfully! Output saved to audit_step1_data.json and audit_step1_live_homepage.png');

  await browser.close();
}

main().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
