import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function check(url) {
  console.log('Fetching:', url);
  const res = await fetch(url, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  return text;
}

async function run() {
  const themesHtml = await check('https://reflectionelite.ataanalytiq.com/wp-admin/themes.php');
  fs.writeFileSync('themes.html', themesHtml);

  const pluginsHtml = await check('https://reflectionelite.ataanalytiq.com/wp-admin/plugins.php');
  fs.writeFileSync('plugins.html', pluginsHtml);

  const readingHtml = await check('https://reflectionelite.ataanalytiq.com/wp-admin/options-reading.php');
  fs.writeFileSync('reading.html', readingHtml);

  const pagesHtml = await check('https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=page');
  fs.writeFileSync('pages.html', pagesHtml);

  const homeHtml = await check('https://reflectionelite.ataanalytiq.com/');
  fs.writeFileSync('home.html', homeHtml);

  console.log('All files saved successfully!');
}

run().catch(console.error);
