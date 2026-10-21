async function run() {
  const r = await fetch('https://reflectionelite.com/my-account/?v=' + Date.now());
  const h = await r.text();
  console.log('class="re-unified-header-container":', h.includes('class="re-unified-header-container"'));
  console.log('class="re-unified-footer-container":', h.includes('class="re-unified-footer-container"'));
  console.log('[woocommerce_my_account]:', h.includes('[woocommerce_my_account]'));
  
  // Find entry-content
  const entryIdx = h.indexOf('entry-content');
  if (entryIdx !== -1) {
    console.log('entry-content snippet:', h.substring(entryIdx, entryIdx + 500));
  }
}
run();
