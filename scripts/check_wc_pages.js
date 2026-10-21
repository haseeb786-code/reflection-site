async function run() {
  for (const page of ['cart', 'checkout', 'my-account']) {
    const r = await fetch(`https://reflectionelite.com/${page}/?v=` + Date.now());
    const h = await r.text();
    console.log(`/${page}/:`, {
      hasHeader: h.includes('class="re-unified-header-container"'),
      hasFooter: h.includes('class="re-unified-footer-container"') || h.includes('site-footer')
    });
  }
}
run();
