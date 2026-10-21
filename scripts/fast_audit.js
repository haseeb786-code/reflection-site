import fs from 'fs';

// 1. THEMES
const themesHtml = fs.readFileSync('themes.html', 'utf8');
const activeThemeMatch = themesHtml.match(/<div class="theme active"[\s\S]*?<h2 class="theme-name"[^>]*>([\s\S]*?)<\/h2>/i);
const activeThemeAuthor = themesHtml.match(/<p class="theme-author">([\s\S]*?)<\/p>/i);
const activeThemeVersion = themesHtml.match(/<span class="theme-version">([\s\S]*?)<\/span>/i);

console.log('=== THEME AUDIT ===');
console.log('Active Theme Name:', activeThemeMatch ? activeThemeMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown');
console.log('Active Theme Author:', activeThemeAuthor ? activeThemeAuthor[1].replace(/<[^>]+>/g, '').trim() : 'Unknown');
console.log('Active Theme Version:', activeThemeVersion ? activeThemeVersion[1].replace(/<[^>]+>/g, '').trim() : 'Unknown');

// 2. PLUGINS
console.log('\n=== PLUGINS AUDIT ===');
const pluginsHtml = fs.readFileSync('plugins.html', 'utf8');
const pluginMatches = [...pluginsHtml.matchAll(/<tr\s+class="([^"]*)"\s+data-slug="([^"]+)"[\s\S]*?<\/tr>/gi)];
const plugins = [];
for (const match of pluginMatches) {
  const rowClasses = match[1];
  const slug = match[2];
  const rowHtml = match[0];
  const isActive = rowClasses.includes('active');
  const titleMatch = rowHtml.match(/<td\s+class=['"]plugin-title[^'"]*['"]>[\s\S]*?<strong>([^<]+)<\/strong>/i);
  const title = titleMatch ? titleMatch[1].trim() : slug;
  const versionMatch = rowHtml.match(/<span\s+class=['"]plugin-version-author-uri['"]>([\s\S]*?)<\/span>/i);
  const version = versionMatch ? versionMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  plugins.push({ slug, title, isActive, version });
}

console.log(`Total Plugins Found: ${plugins.length}`);
const activePlugins = plugins.filter(p => p.isActive);
console.log(`Active Plugins (${activePlugins.length}):`);
activePlugins.forEach(p => console.log(` - [ACTIVE] ${p.title} (${p.slug}) [${p.version}]`));

const inactivePlugins = plugins.filter(p => !p.isActive);
console.log(`\nInactive Plugins (${inactivePlugins.length}):`);
inactivePlugins.forEach(p => console.log(` - [INACTIVE] ${p.title} (${p.slug})`));

// 3. READING SETTINGS
console.log('\n=== READING SETTINGS AUDIT ===');
const readingHtml = fs.readFileSync('reading.html', 'utf8');
const showOnFront = readingHtml.match(/name="show_on_front"\s+value="([^"]+)"\s+checked/i);
const pageOnFront = readingHtml.match(/<select\s+name='page_on_front'[\s\S]*?<option\s+class="level-0"\s+value="(\d+)"\s+selected="selected">([^<]+)<\/option>/i);
console.log('Show on front:', showOnFront ? showOnFront[1] : 'Unknown');
console.log('Homepage page ID & Title:', pageOnFront ? `ID: ${pageOnFront[1]}, Title: ${pageOnFront[2]}` : 'None (Latest posts)');

// 4. PAGES AUDIT
console.log('\n=== PAGES AUDIT ===');
const pagesHtml = fs.readFileSync('pages.html', 'utf8');
const pageRows = pagesHtml.split(/<tr id="post-(\d+)"/i).slice(1);
const pages = [];
for (let i = 0; i < pageRows.length; i += 2) {
  const id = pageRows[i];
  const chunk = pageRows[i+1] || '';
  const titleMatch = chunk.match(/class="row-title"[^>]*>([\s\S]*?)<\/a>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const postStateMatch = chunk.match(/<span class="post-state">([\s\S]*?)<\/span>/i);
  const postState = postStateMatch ? postStateMatch[1].trim() : '';
  const dateMatch = chunk.match(/<td class="date column-date"[^>]*>([\s\S]*?)<\/td>/i);
  const date = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  pages.push({ id, title, postState, date });
}
pages.forEach(p => console.log(` - Page #${p.id}: "${p.title}" [State: ${p.postState || 'Published'}] (${p.date})`));

// 5. HOMEPAGE AUDIT
console.log('\n=== HOMEPAGE SECTIONS & FONTS AUDIT ===');
const homeHtml = fs.readFileSync('home.html', 'utf8');

// Title
const titleMatch = homeHtml.match(/<title>([\s\S]*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1].trim() : '');

// Fonts and Google Fonts
const googleFonts = [...homeHtml.matchAll(/fonts\.googleapis\.com\/css2\?[^"'\s]+/gi)].map(m => m[0]);
console.log('Google Fonts linked:', [...new Set(googleFonts)]);

// Headings
const h1s = [...homeHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h2s = [...homeHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h3s = [...homeHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('\nH1 Headings:', h1s);
console.log('H2 Headings:', h2s);
console.log('H3 Headings:', h3s);

// Detect elementor / builder classes in HTML
const isElementor = homeHtml.includes('elementor');
const isDivi = homeHtml.includes('et_pb_section');
const isWpBakery = homeHtml.includes('vc_row');
const isGutenberg = homeHtml.includes('wp-block-');

console.log('\nBuilder traces on Homepage:');
console.log(' - Elementor:', isElementor);
console.log(' - Divi:', isDivi);
console.log(' - WPBakery:', isWpBakery);
console.log(' - Gutenberg / Block Editor:', isGutenberg);

// Save parsed output
fs.writeFileSync('step1_audit_summary.json', JSON.stringify({
  activeTheme: {
    name: activeThemeMatch ? activeThemeMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown',
    author: activeThemeAuthor ? activeThemeAuthor[1].replace(/<[^>]+>/g, '').trim() : 'Unknown',
    version: activeThemeVersion ? activeThemeVersion[1].replace(/<[^>]+>/g, '').trim() : 'Unknown'
  },
  activePlugins,
  inactivePlugins,
  reading: {
    showOnFront: showOnFront ? showOnFront[1] : 'Unknown',
    pageOnFrontId: pageOnFront ? pageOnFront[1] : null,
    pageOnFrontTitle: pageOnFront ? pageOnFront[2] : null
  },
  pages,
  home: {
    title: titleMatch ? titleMatch[1].trim() : '',
    googleFonts: [...new Set(googleFonts)],
    h1s,
    h2s,
    h3s,
    builder: { isElementor, isDivi, isWpBakery, isGutenberg }
  }
}, null, 2));

console.log('\nFast audit completed successfully!');
