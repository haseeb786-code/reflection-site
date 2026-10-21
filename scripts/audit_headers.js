import fs from 'fs';

async function main() {
  const urls = [
    'https://reflectionelite.com/',
    'https://reflectionelite.com/shop/',
    'https://reflectionelite.com/about-us/',
    'https://reflectionelite.com/contact/',
    'https://reflectionelite.com/custom-dimensions/',
    'https://reflectionelite.com/refund_returns-2/',
    'https://reflectionelite.com/privacy-policy-2/',
    'https://reflectionelite.com/cart/',
    'https://reflectionelite.com/checkout/',
    'https://reflectionelite.com/my-account/'
  ];

  for (const url of urls) {
    const res = await fetch(url);
    const html = await res.text();
    const hasBr = html.includes('re-hamburger-btn"><br />') || html.includes('re-hamburger-btn"><br>');
    const hasSearch = html.includes('re-search-toggle-btn');
    const hasAccount = html.includes('re-account-link');
    const hasBrokenSvg = html.includes('width="20" height="20"></p>');
    console.log(url.padEnd(45), 'hasBr:', hasBr, 'hasSearch:', hasSearch, 'hasAccount:', hasAccount, 'hasBrokenSvg:', hasBrokenSvg);
  }
}

main().catch(console.error);
