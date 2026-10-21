import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');

// Search for comparison-slider in linked CSS or embedded CSS
const cssLinks = [...html.matchAll(/<link[^>]+href="([^">]+)"/g)].map(m => m[1]);
console.log('CSS links in page:', cssLinks.filter(l => l.includes('comparison') || l.includes('style')));

// Search in page HTML for comparison-slider styles
const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
styleMatches.forEach((s, idx) => {
  if (s.includes('comparison-slider') || s.includes('cs-slider')) {
    console.log(`Style block ${idx}:`, s.substring(0, 1000));
  }
});
