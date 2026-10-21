async function run() {
  const r = await fetch('https://reflectionelite.com/');
  const h = await r.text();
  const cssMatch = h.match(/<style id="te-global-luxury-system">([\s\S]*?)<\/style>/);
  if (cssMatch) {
    const css = cssMatch[1];
    const headerLines = css.split('\n').filter(l => l.includes('.site-header') || l.includes('ast-main-header') || l.includes('.main-header-bar') || l.includes('header'));
    console.log('Header CSS rules:\n', headerLines.slice(0, 30).join('\n'));
  }
}
run();
