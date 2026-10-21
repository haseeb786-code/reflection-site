async function run() {
  const res = await fetch('https://reflectionelite.com/my-account/?v=' + Date.now());
  const html = await res.text();
  const loginIdx = html.indexOf('customer_login');
  if (loginIdx !== -1) {
    console.log(html.substring(loginIdx - 50, loginIdx + 1200));
  }
}
run();
