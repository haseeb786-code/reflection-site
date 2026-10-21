import fs from 'fs';

async function check() {
  const res = await fetch('https://reflectionelite.com/');
  const html = await res.text();
  console.log('Homepage length:', html.length);
  
  const heroMatch = html.match(/<section class="re-hero-section"[\s\S]*?<\/section>/);
  console.log('Hero section found:', !!heroMatch);
  
  const collectionsMatch = html.match(/<section class="re-collections-section"[\s\S]*?<\/section>/);
  console.log('Collections section found:', !!collectionsMatch);
  if (collectionsMatch) {
    console.log(collectionsMatch[0]);
  }
  
  const bespokeMatch = html.match(/<section id="custom-dimensions"[\s\S]*?<\/section>/);
  console.log('Bespoke section on home found:', !!bespokeMatch);
  
  const bespokePageRes = await fetch('https://reflectionelite.com/custom-dimensions/');
  const bespokePageHtml = await bespokePageRes.text();
  console.log('Custom dimensions page length:', bespokePageHtml.length);
  const entryTitleMatch = bespokePageHtml.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>[\s\S]*?<\/h1>/i);
  console.log('Entry title on custom-dimensions:', entryTitleMatch ? entryTitleMatch[0] : 'None');
}

check().catch(console.error);
