import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function parseAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Parse Themes
  console.log('--- 1. PARSING THEMES ---');
  const themesHtml = fs.readFileSync('themes.html', 'utf8');
  await page.setContent(themesHtml);
  const themeResult = await page.evaluate(() => {
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
  console.log('Theme Result:', JSON.stringify(themeResult, null, 2));

  // 2. Parse Plugins
  console.log('\n--- 2. PARSING PLUGINS ---');
  const pluginsHtml = fs.readFileSync('plugins.html', 'utf8');
  await page.setContent(pluginsHtml);
  const pluginResult = await page.evaluate(() => {
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
  console.log(`Total Plugins: ${pluginResult.length}`);
  const activePlugins = pluginResult.filter(p => p.isActive);
  console.log(`Active Plugins (${activePlugins.length}):`);
  activePlugins.forEach(p => console.log(`  * ${p.title} (${p.slug}) - ${p.version}`));
  const inactivePlugins = pluginResult.filter(p => !p.isActive);
  console.log(`Inactive Plugins (${inactivePlugins.length}):`);
  inactivePlugins.forEach(p => console.log(`  - [Inactive] ${p.title} (${p.slug})`));

  // 3. Parse Reading Settings
  console.log('\n--- 3. PARSING READING SETTINGS ---');
  const readingHtml = fs.readFileSync('reading.html', 'utf8');
  await page.setContent(readingHtml);
  const readingResult = await page.evaluate(() => {
    const showOnFront = document.querySelector('input[name="show_on_front"]:checked')?.value;
    const pageOnFront = document.querySelector('select[name="page_on_front"] option:checked')?.text;
    const pageOnFrontId = document.querySelector('select[name="page_on_front"] option:checked')?.value;
    const pageForPosts = document.querySelector('select[name="page_for_posts"] option:checked')?.text;
    return { showOnFront, pageOnFront, pageOnFrontId, pageForPosts };
  });
  console.log('Reading Settings:', JSON.stringify(readingResult, null, 2));

  // 4. Parse Pages
  console.log('\n--- 4. PARSING PAGES ---');
  const pagesHtml = fs.readFileSync('pages.html', 'utf8');
  await page.setContent(pagesHtml);
  const pagesResult = await page.evaluate(() => {
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
  console.log('Pages List:', JSON.stringify(pagesResult, null, 2));

  // 5. Parse Homepage
  console.log('\n--- 5. PARSING HOMEPAGE STRUCTURE & FONTS ---');
  const homeHtml = fs.readFileSync('home.html', 'utf8');
  await page.setContent(homeHtml);
  const homeResult = await page.evaluate(() => {
    // Collect font links
    const fontLinks = Array.from(document.querySelectorAll('link[href*="font"], link[href*="typekit"], link[href*="fonts.googleapis.com"]'))
      .map(el => el.href);

    // Collect style tags with @import or @font-face
    const styleTags = Array.from(document.querySelectorAll('style'))
      .map(s => s.textContent)
      .filter(t => t.includes('@font-face') || t.includes('@import') || t.includes('font-family'));

    // Check headings, navigation, buttons, paragraphs
    const getSelectorInfo = (sel) => {
      const els = Array.from(document.querySelectorAll(sel));
      return els.slice(0, 5).map(el => {
        const comp = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          class: el.className,
          fontFamily: comp.fontFamily,
          fontSize: comp.fontSize,
          fontWeight: comp.fontWeight,
          lineHeight: comp.lineHeight,
          text: el.innerText.trim().slice(0, 80).replace(/\s+/g, ' ')
        };
      });
    };

    // Extract section breakdown
    // Identify top-level containers in body
    const bodyChildren = Array.from(document.body.children).map((child, index) => {
      const headings = Array.from(child.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => `${h.tagName}: ${h.innerText.trim()}`);
      return {
        index: index + 1,
        tag: child.tagName,
        id: child.id,
        className: child.className,
        headings,
        snippet: child.innerText.trim().slice(0, 150).replace(/\s+/g, ' ')
      };
    });

    return {
      title: document.title,
      fontLinks,
      sampleStylesSnippet: styleTags.join('\n').slice(0, 2000),
      h1: getSelectorInfo('h1'),
      h2: getSelectorInfo('h2'),
      h3: getSelectorInfo('h3'),
      bodyFont: getSelectorInfo('body, p'),
      navFont: getSelectorInfo('nav, header, .nav, .menu, a'),
      bodyChildren
    };
  });

  const fullAuditReport = {
    theme: themeResult,
    plugins: {
      total: pluginResult.length,
      active: activePlugins,
      inactive: inactivePlugins
    },
    reading: readingResult,
    pages: pagesResult,
    home: homeResult
  };

  fs.writeFileSync('step1_audit_parsed.json', JSON.stringify(fullAuditReport, null, 2));
  console.log('\nAudit data parsed and saved to step1_audit_parsed.json');

  await browser.close();
}

parseAll().catch(console.error);
