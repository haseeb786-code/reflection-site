import fs from 'fs';

async function check() {
  try {
    const res = await fetch('https://reflectionelite.ataanalytiq.com/shop/');
    const html = await res.text();
    fs.writeFileSync('live_shop_page.html', html);
    console.log('Saved live_shop_page.html, length:', html.length);
  } catch (e) {
    console.error('Error fetching ataanalytiq:', e.message);
  }

  try {
    const res2 = await fetch('https://reflectionelite.com/shop/');
    const html2 = await res2.text();
    fs.writeFileSync('reflectionelite_com_shop.html', html2);
    console.log('Saved reflectionelite_com_shop.html, length:', html2.length);
  } catch (e) {
    console.error('Error fetching reflectionelite.com:', e.message);
  }
}

check();
