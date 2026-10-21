async function main() {
  const res = await fetch('https://reflectionelite.com/shop/?nocache=' + Date.now());
  const html = await res.text();
  const searchStr = 're-header-left-actions';
  let pos = 0;
  while ((pos = html.indexOf(searchStr, pos)) !== -1) {
    console.log('Found at pos:', pos);
    console.log(html.slice(pos - 30, pos + 400));
    console.log('--------------------------------------------------');
    pos += searchStr.length;
  }
}

main().catch(console.error);
