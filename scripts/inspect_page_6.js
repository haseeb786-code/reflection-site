import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/6`, {
    headers: { Cookie: cookies }
  });
  const data = await res.json();
  console.log('Page 6 ID:', data.id);
  console.log('Page 6 Slug:', data.slug);
  console.log('Page 6 Title:', data.title?.rendered);
  console.log('Page 6 Content Length:', data.content?.rendered?.length);
  console.log('Snippet of Page 6 Content:');
  console.log(data.content?.rendered?.slice(0, 500));

  const content = data.content?.rendered || '';
  const cards = [...content.matchAll(/class="card-title">([\s\S]*?)<\/h3>/g)].map(m => m[1].trim());
  console.log('Cards in Page 6:', cards);
  const heroH1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  console.log('H1 in Page 6:', heroH1 ? heroH1[1].trim() : 'None');
}

main().catch(console.error);
