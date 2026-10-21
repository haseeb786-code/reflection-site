import { execFileSync } from 'child_process';
import fs from 'fs';

const pages = [
  { slug: 'home', url: 'https://reflectionelite.com/' },
  { slug: 'shop', url: 'https://reflectionelite.com/shop/' },
  { slug: 'about-us', url: 'https://reflectionelite.com/about-us/' },
  { slug: 'contact', url: 'https://reflectionelite.com/contact/' },
  { slug: 'custom-dimensions', url: 'https://reflectionelite.com/custom-dimensions/' },
  { slug: 'refund_returns-2', url: 'https://reflectionelite.com/refund_returns-2/' },
  { slug: 'privacy-policy-2', url: 'https://reflectionelite.com/privacy-policy-2/' },
  { slug: 'cart', url: 'https://reflectionelite.com/cart/' },
  { slug: 'checkout', url: 'https://reflectionelite.com/checkout/' },
  { slug: 'my-account', url: 'https://reflectionelite.com/my-account/' }
];

console.log('--- AUDITING LIVE HEADERS ON ALL 10 PAGES ---');
for (const p of pages) {
  try {
    const html = execFileSync('curl.exe', ['-s', '-L', p.url], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const hasBrInHamburger = html.includes('re-hamburger-btn"><br />') || html.includes('re-hamburger-btn"><br>');
    const hasSearch = html.includes('re-search-toggle-btn');
    const hasAccount = html.includes('re-account-link');
    const hasBrokenSvg = html.includes('width="20" height="20"></p>');
    const hasPAutopInHeader = html.includes('</p></div>\n</p></div>\n</p></div>');
    console.log(
      p.slug.padEnd(20),
      '| hasSearch:', hasSearch,
      '| hasAccount:', hasAccount,
      '| hasBrInHamburger:', hasBrInHamburger,
      '| hasBrokenSvg:', hasBrokenSvg,
      '| wpautopCorrupted:', hasPAutopInHeader
    );
  } catch (e) {
    console.error(`Failed to fetch ${p.slug}:`, e.message);
  }
}
