async function main() {
  const res = await fetch('https://reflectionelite.com/?nocache=' + Date.now(), {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const idx = html.indexOf('<section class="te-duo-showcase-section"');
  if (idx !== -1) {
    console.log(html.slice(idx, idx + 2000));
  } else {
    console.log('section te-duo-showcase-section not found in HTML body');
    const scIdx = html.indexOf('te_duo_showcase');
    console.log('te_duo_showcase shortcode index:', scIdx);
    if (scIdx !== -1) {
      console.log(html.slice(scIdx - 50, scIdx + 150));
    }
  }
}

main().catch(console.error);
