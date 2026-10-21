async function run() {
  const res = await fetch('https://reflectionelite.com/');
  const html = await res.text();
  const barIdx = html.indexOf('id="reSearchOverlayBar"');
  console.log('reSearchOverlayBar index:', barIdx);
  if (barIdx !== -1) {
    console.log(html.substring(barIdx - 40, barIdx + 800));
  }
}
run();
