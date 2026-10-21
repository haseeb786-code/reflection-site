async function check() {
  const res = await fetch('https://reflectionelite.com/shop/');
  const html = await res.text();
  const pIdx = html.indexOf('<div id="primary"');
  if (pIdx !== -1) {
    console.log(html.slice(pIdx, pIdx + 1500));
  } else {
    const cIdx = html.indexOf('<div id="content"');
    if (cIdx !== -1) {
      console.log(html.slice(cIdx, cIdx + 1500));
    } else {
      console.log('Neither primary nor content found. HTML length:', html.length);
    }
  }
}
check().catch(console.error);
