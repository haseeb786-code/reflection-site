async function run() {
  const r = await fetch('https://reflectionelite.com/');
  const html = await r.text();
  const formIdx = html.indexOf('<form role="search"');
  console.log('formIdx:', formIdx);
  if (formIdx !== -1) {
    console.log(html.substring(formIdx, formIdx + 700));
  }
}
run();
