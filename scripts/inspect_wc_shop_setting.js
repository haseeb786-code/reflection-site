import { getProdAuth } from './prod_auth_helper.js';

async function check() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wc-settings&tab=products`, {
    headers: { Cookie: cookies }
  });
  const text = await res.text();
  const match = text.match(/name="woocommerce_shop_page_id"[\s\S]*?<\/select>/i);
  if (match) {
    const selected = match[0].match(/<option[^>]*selected[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/i);
    console.log('Selected Shop Page option:', selected ? selected[0] : 'None selected');
  } else {
    console.log('woocommerce_shop_page_id select not found on page');
  }
}

check().catch(console.error);
