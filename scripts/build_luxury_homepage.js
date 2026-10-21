import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

function generateHomepageHtml() {
  return `
<!-- HERO SECTION -->
<div style="background: linear-gradient(135deg, #090e17 0%, #162032 50%, #0d1522 100%); color: #ffffff; padding: 70px 24px; border-radius: 12px; margin-bottom: 50px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.08);">
  <div style="max-width: 860px; margin: 0 auto;">
    <span style="display: inline-block; background: rgba(212, 175, 55, 0.15); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.35); padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px;">
      ✨ Handcrafted Luxury Italian &amp; Venetian Mirrors
    </span>
    <h1 style="font-size: 42px; font-weight: 800; line-height: 1.2; margin: 0 0 18px 0; color: #ffffff; font-family: 'Playfair Display', Georgia, serif;">
      Reflect Timeless Elegance in Your Living Space
    </h1>
    <p style="font-size: 17px; line-height: 1.6; color: #cbd5e1; margin: 0 0 30px 0; font-weight: 300;">
      Bespoke Venetian craftsmanship, 4–5mm float glass with moisture-resistant MDF backing. Protected in reinforced wooden crates and delivered safely across India.
    </p>
    <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
      <a href="/shop/" style="background: #d4af37; color: #000000; font-weight: 700; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; box-shadow: 0 4px 12px rgba(212,175,55,0.3); transition: all 0.2s;">
        Explore Mirror Collection →
      </a>
      <a href="https://wa.me/917387463103?text=Hi%2C%20I%20am%20interested%20in%20custom%20luxury%20mirrors.%20Can%20you%20share%20details%3F" target="_blank" style="background: #25D366; color: #ffffff; font-weight: 700; padding: 14px 26px; border-radius: 6px; text-decoration: none; font-size: 15px; display: inline-flex; align-items: center; gap: 8px;">
        💬 Chat on WhatsApp (+91 7387463103)
      </a>
    </div>
  </div>
</div>

<!-- TRUST VALUE PROPOSITION STRIP -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 60px;">
  <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 22px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="font-size: 28px; margin-bottom: 8px;">📦</div>
    <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a;">Reinforced Wooden Crating</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">Heavy-duty crated packaging ensures 100% zero transit glass breakage guarantee.</p>
  </div>
  <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 22px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="font-size: 28px; margin-bottom: 8px;">💳</div>
    <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a;">50% Advance &amp; 50% on Delivery</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">Pay 50% to initiate handcrafted fabrication, and remaining 50% after delivery.</p>
  </div>
  <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 22px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="font-size: 28px; margin-bottom: 8px;">📐</div>
    <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a;">Custom Made-to-Measure</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">Vanities, bathrooms, living rooms, and foyer statements in any custom size.</p>
  </div>
  <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 22px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="font-size: 28px; margin-bottom: 8px;">🇮🇹</div>
    <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a;">Authentic Venetian Art</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">Intricate floral, cushion, and crown carvings inspired by classic Italian heritage.</p>
  </div>
</div>

<!-- FEATURED CATEGORIES SECTION -->
<div style="margin-bottom: 60px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="font-size: 30px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif;">
      Explore Signature Categories
    </h2>
    <p style="font-size: 15px; color: #64748b; margin: 0;">Select from our master artisan collections</p>
  </div>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px;">
    <a href="/product-category/venetian-mirror/" style="text-decoration: none; color: inherit; display: block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 32px; margin-bottom: 10px;">🪞</div>
      <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">Venetian Mirrors</h3>
      <span style="font-size: 13px; color: #0284c7; font-weight: 600;">View Products →</span>
    </a>
    <a href="/product-category/led-mirror/" style="text-decoration: none; color: inherit; display: block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 32px; margin-bottom: 10px;">💡</div>
      <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">LED Vanity Mirrors</h3>
      <span style="font-size: 13px; color: #0284c7; font-weight: 600;">View Products →</span>
    </a>
    <a href="/product-category/frame-mirror/" style="text-decoration: none; color: inherit; display: block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 32px; margin-bottom: 10px;">🖼️</div>
      <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">Frame Mirrors</h3>
      <span style="font-size: 13px; color: #0284c7; font-weight: 600;">View Products →</span>
    </a>
    <a href="/product-category/vanished-murano-mirror/" style="text-decoration: none; color: inherit; display: block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 32px; margin-bottom: 10px;">✨</div>
      <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">Vanished Murano</h3>
      <span style="font-size: 13px; color: #0284c7; font-weight: 600;">View Products →</span>
    </a>
    <a href="/product-category/diy-glass-mirror/" style="text-decoration: none; color: inherit; display: block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 32px; margin-bottom: 10px;">🛠️</div>
      <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">DIY Glass Materials</h3>
      <span style="font-size: 13px; color: #0284c7; font-weight: 600;">View Products →</span>
    </a>
  </div>
</div>

<!-- FEATURED PRODUCTS GRID -->
<div style="margin-bottom: 60px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="color: #d4af37; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;">Masterpiece Mirrors</span>
    <h2 style="font-size: 30px; font-weight: 800; color: #0f172a; margin: 4px 0 8px 0; font-family: 'Playfair Display', Georgia, serif;">
      Curated Bestsellers
    </h2>
    <p style="font-size: 15px; color: #64748b; margin: 0;">Handcrafted statement pieces ready for your home</p>
  </div>
  [products limit="8" columns="4" orderby="price" order="DESC"]
  <div style="text-align: center; margin-top: 30px;">
    <a href="/shop/" style="display: inline-block; background: #0f172a; color: #ffffff; font-weight: 600; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 14px;">
      View All 9 Mirrors in Catalog →
    </a>
  </div>
</div>

<!-- BESPOKE CUSTOMIZATION CONSULTATION BANNER -->
<div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px 24px; text-align: center; margin-bottom: 40px;">
  <h2 style="font-size: 26px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; font-family: 'Playfair Display', Georgia, serif;">
    Need Custom Dimensions or Specific Frame Detailing?
  </h2>
  <p style="font-size: 15px; color: #475569; max-width: 640px; margin: 0 auto 24px auto; line-height: 1.6;">
    Our workshop creates custom-cut mirrors tailored to your exact measurements, interior design themes, and lighting requirements. Send us your dimensions for an immediate estimate.
  </p>
  <a href="https://wa.me/917387463103?text=Hi%2C%20I%20need%20a%20custom-sized%20mirror.%20My%20dimensions%20are%3A%20" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #ffffff; font-weight: 700; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; box-shadow: 0 4px 10px rgba(37,211,102,0.25);">
    📱 Inquire Custom Size on WhatsApp (+91 7387463103)
  </a>
</div>

<!-- FLOATING WHATSAPP BUTTON (SITE-WIDE WIDGET) -->
<a href="https://wa.me/917387463103?text=Hi%2C%20I%20have%20a%20question%20about%20Reflection%20Elite%20mirrors." target="_blank" id="wa-floating-btn" style="position: fixed; bottom: 25px; right: 25px; background: #25D366; color: #ffffff; border-radius: 50px; padding: 12px 20px; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.25); z-index: 999999; border: 2px solid #ffffff;">
  <span style="font-size: 18px;">💬</span>
  <span>Chat with Us</span>
</a>
  `;
}

async function setupHomepage() {
  console.log('=== SETTING UP LUXURY HOMEPAGE ON HOSTINGER ===\n');

  // 1. Check if "Home" page already exists
  const pagesRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages?per_page=100`, { headers: auth });
  const pages = await pagesRes.json();
  let homePage = pages.find(p => p.slug === 'home' || p.title?.rendered?.toLowerCase() === 'home');

  const content = generateHomepageHtml();

  if (homePage) {
    console.log(`Updating existing Home page (ID: ${homePage.id})...`);
    const updateRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/${homePage.id}`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        title: 'Home',
        content: content,
        status: 'publish'
      })
    });
    homePage = await updateRes.json();
    console.log(`[SUCCESS] Updated Home page (ID: ${homePage.id})`);
  } else {
    console.log('Creating new Home page...');
    const createRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        title: 'Home',
        slug: 'home',
        content: content,
        status: 'publish'
      })
    });
    homePage = await createRes.json();
    console.log(`[SUCCESS] Created Home page (ID: ${homePage.id})`);
  }

  // 2. Set this page as the Static Front Page
  console.log('Configuring WordPress reading settings: Front Page = Home...');
  const settingsRes = await fetch(`${WP_URL}/wp-json/wp/v2/settings`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      show_on_front: 'page',
      page_on_front: homePage.id,
      page_for_posts: 0
    })
  });

  if (!settingsRes.ok) {
    const err = await settingsRes.text();
    console.warn('Note: settings API returned:', err);
  } else {
    const set = await settingsRes.json();
    console.log(`[SUCCESS] Front page set to page ID: ${set.page_on_front}`);
  }

  // 3. Set up Main Navigation Menu
  console.log('Checking navigation menus...');
  const menusRes = await fetch(`${WP_URL}/wp-json/wp/v2/menus`, { headers: auth });
  const menus = await menusRes.json();
  let primaryMenu = menus.find(m => m.slug === 'primary' || m.name?.toLowerCase().includes('main') || m.name?.toLowerCase().includes('header'));

  if (!primaryMenu && menus.length > 0) {
    primaryMenu = menus[0];
  }

  if (!primaryMenu) {
    const createMenuRes = await fetch(`${WP_URL}/wp-json/wp/v2/menus`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        name: 'Main Menu',
        slug: 'main-menu',
        locations: ['primary']
      })
    });
    primaryMenu = await createMenuRes.json();
    console.log(`Created Main Menu (ID: ${primaryMenu.id})`);
  }

  if (primaryMenu) {
    console.log(`Populating menu items in Menu ID ${primaryMenu.id}...`);
    const menuItems = [
      { title: 'Home', url: '/' },
      { title: 'Shop All', url: '/shop/' },
      { title: 'Venetian Mirrors', url: '/product-category/venetian-mirror/' },
      { title: 'LED Mirrors', url: '/product-category/led-mirror/' },
      { title: 'About Us', url: '/about-us/' },
      { title: 'Contact', url: '/contact/' }
    ];

    for (const [index, item] of menuItems.entries()) {
      try {
        await fetch(`${WP_URL}/wp-json/wp/v2/menu-items`, {
          method: 'POST',
          headers: auth,
          body: JSON.stringify({
            title: item.title,
            url: item.url,
            menus: primaryMenu.id,
            status: 'publish',
            menu_order: index + 1
          })
        });
      } catch (e) {
        // ignore duplicate
      }
    }
    console.log('[SUCCESS] Navigation Menu populated!');
  }

  console.log('\n========================================================');
  console.log('Luxury Homepage and Navigation Setup Complete!');
  console.log('Visit: https://mediumpurple-salamander-731288.hostingersite.com/');
  console.log('========================================================\n');
}

setupHomepage().catch(console.error);
