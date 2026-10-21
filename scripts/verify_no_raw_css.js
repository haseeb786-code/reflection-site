import fs from 'fs';

async function verify() {
  const res = await fetch('https://reflectionelite.com/');
  const html = await res.text();

  const bodyStart = html.indexOf('<body');
  const bodyContent = html.substring(bodyStart, bodyStart + 2000);
  console.log('=== BODY START ===\n', bodyContent.substring(0, 500));

  const hasRawCssInBody = bodyContent.includes('RE-LUXURY-CART-SYSTEM-START');
  console.log('Does <body> contain raw CSS comment?', hasRawCssInBody);

  const headEnd = html.indexOf('</head>');
  const headContent = html.substring(0, headEnd);
  const hasStyleTag = headContent.includes('id="re-luxury-cart-styles"');
  console.log('Is <style id="re-luxury-cart-styles"> properly inside <head>?', hasStyleTag);
}

verify().catch(console.error);
