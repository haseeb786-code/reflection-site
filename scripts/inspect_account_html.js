async function checkAccountHtml() {
  const res = await fetch('https://reflectionelite.com/my-account/');
  const html = await res.text();
  const idx = html.indexOf('customer_login');
  console.log('Index of customer_login:', idx);
  if (idx !== -1) {
    console.log(html.substring(idx - 100, idx + 2500));
  } else {
    console.log('customer_login not found. Search for woocommerce:');
    const wcIdx = html.indexOf('woocommerce');
    console.log(html.substring(wcIdx, wcIdx + 1000));
  }
}

checkAccountHtml().catch(console.error);
