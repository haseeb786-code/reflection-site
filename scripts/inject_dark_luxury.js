import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function injectDarkLuxury() {
  console.log('Logging in to WordPress admin...');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  console.log('Fetching WPCode settings page...');
  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find insert-headers-and-footers_nonce on WPCode page');
  }
  const nonce = nonceMatch[1];
  console.log('Found nonce:', nonce);

  // Read header CSS and footer scripts
  const headerCode = `
<!-- Google Fonts: Cinzel, Playfair Display & Montserrat -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

<style id="luxury-dark-gold-theme">
  :root {
    --bg-dark: #090c10;
    --bg-surface: #12161f;
    --bg-card: #161c28;
    --bg-elevated: #1d2433;
    --gold-primary: #d4af37;
    --gold-light: #f5e7a9;
    --gold-dark: #aa771c;
    --gold-gradient: linear-gradient(135deg, #e8c86d 0%, #d4af37 50%, #996515 100%);
    --gold-text-gradient: linear-gradient(135deg, #fff3c4 0%, #d4af37 60%, #b8860b 100%);
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --border-gold: rgba(212, 175, 55, 0.28);
    --border-subtle: rgba(255, 255, 255, 0.08);
    --shadow-luxury: 0 12px 30px rgba(0, 0, 0, 0.6);
    --shadow-gold: 0 0 25px rgba(212, 175, 55, 0.22);
  }

  /* Global Body & Layout Reset */
  html, body, #page, .site, .site-content, .ast-container, #content {
    background-color: var(--bg-dark) !important;
    color: var(--text-primary) !important;
    font-family: 'Montserrat', sans-serif !important;
    -webkit-font-smoothing: antialiased;
  }

  /* Headings Typography */
  h1, h2, h3, h4, h5, h6,
  .site-title a, .ast-site-title a,
  .entry-title, .product_title,
  .woocommerce-loop-product__title {
    font-family: 'Cinzel', 'Playfair Display', serif !important;
    letter-spacing: 0.05em !important;
    color: #ffffff !important;
  }

  /* Site Header & Navigation */
  .main-header-bar, .ast-primary-header-bar, .site-header, header#masthead {
    background-color: #06080b !important;
    border-bottom: 1px solid var(--border-gold) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7) !important;
  }
  .main-header-bar a, .ast-site-title a, .main-navigation a {
    color: #f1f5f9 !important;
    transition: color 0.3s ease;
  }
  .main-navigation a:hover, .ast-header-break-point .main-navigation a:hover {
    color: var(--gold-primary) !important;
  }
  .site-title a {
    background: var(--gold-text-gradient) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    font-weight: 800 !important;
    font-size: 1.5rem !important;
  }

  /* Hero & Custom Sections */
  .luxury-hero-section {
    background: radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.12) 0%, rgba(9, 12, 16, 0.98) 75%) !important;
    border-bottom: 1px solid var(--border-gold);
  }

  /* Breadcrumbs */
  .woocommerce-breadcrumb, .ast-breadcrumbs {
    color: var(--text-muted) !important;
  }
  .woocommerce-breadcrumb a, .ast-breadcrumbs a {
    color: var(--gold-light) !important;
  }

  /* WooCommerce Shop & Product Cards */
  ul.products {
    margin: 2em 0 !important;
  }
  ul.products li.product,
  .ast-woocommerce-container ul.products li.product {
    background: var(--bg-card) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 12px !important;
    padding: 1.25rem !important;
    box-shadow: var(--shadow-luxury) !important;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative;
    overflow: hidden;
  }
  ul.products li.product:hover,
  .ast-woocommerce-container ul.products li.product:hover {
    transform: translateY(-8px) !important;
    border-color: var(--gold-primary) !important;
    box-shadow: 0 16px 35px rgba(212, 175, 55, 0.2), 0 0 30px rgba(0,0,0,0.8) !important;
  }
  ul.products li.product img {
    border-radius: 8px !important;
    margin-bottom: 1rem !important;
    transition: transform 0.5s ease !important;
  }
  ul.products li.product:hover img {
    transform: scale(1.04) !important;
  }
  .woocommerce-loop-product__title {
    font-size: 1.15rem !important;
    margin: 0.75rem 0 0.5rem 0 !important;
    line-height: 1.35 !important;
  }
  ul.products li.product .price,
  .entry-summary .price {
    color: var(--gold-primary) !important;
    font-weight: 700 !important;
    font-size: 1.25rem !important;
    margin-bottom: 1rem !important;
  }
  ul.products li.product .price del,
  .entry-summary .price del {
    color: var(--text-muted) !important;
    font-size: 0.9em !important;
    opacity: 0.7 !important;
  }
  ul.products li.product .price ins,
  .entry-summary .price ins {
    color: var(--gold-light) !important;
    text-decoration: none !important;
  }

  /* Gold Luxury Buttons */
  .button,
  a.button,
  button.button,
  input.button,
  .woocommerce #respond input#submit,
  .woocommerce a.button,
  .woocommerce button.button,
  .woocommerce input.button,
  .woocommerce #respond input#submit.alt,
  .woocommerce a.button.alt,
  .woocommerce button.button.alt,
  .woocommerce input.button.alt {
    background: var(--gold-gradient) !important;
    color: #07090d !important;
    font-weight: 700 !important;
    font-family: 'Cinzel', serif !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    padding: 12px 26px !important;
    border-radius: 6px !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25) !important;
    transition: all 0.3s ease !important;
  }
  .button:hover,
  a.button:hover,
  button.button:hover,
  input.button:hover,
  .woocommerce a.button:hover,
  .woocommerce button.button:hover,
  .woocommerce input.button:hover,
  .woocommerce #respond input#submit.alt:hover,
  .woocommerce a.button.alt:hover,
  .woocommerce button.button.alt:hover,
  .woocommerce input.button.alt:hover {
    background: linear-gradient(135deg, #fff 0%, #d4af37 100%) !important;
    color: #000 !important;
    box-shadow: 0 6px 25px rgba(212, 175, 55, 0.5) !important;
    transform: translateY(-2px) !important;
  }

  /* Single Product Styling */
  .single-product div.product {
    background: var(--bg-surface) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 16px !important;
    padding: 2.5rem !important;
    margin-top: 2rem !important;
    box-shadow: var(--shadow-luxury) !important;
  }
  .single-product .summary.entry-summary {
    color: var(--text-secondary) !important;
  }
  .woocommerce-product-details__short-description {
    color: var(--text-secondary) !important;
    line-height: 1.7 !important;
  }
  .woocommerce-variation-description {
    color: var(--text-primary) !important;
  }

  /* Form Controls & Inputs */
  input[type="text"], input[type="email"], input[type="tel"], input[type="password"],
  textarea, select, .select2-container--default .select2-selection--single {
    background-color: var(--bg-card) !important;
    border: 1px solid var(--border-gold) !important;
    color: #ffffff !important;
    border-radius: 6px !important;
    padding: 10px 14px !important;
  }
  input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus,
  textarea:focus, select:focus {
    border-color: var(--gold-light) !important;
    outline: none !important;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.3) !important;
  }

  /* Quantity buttons */
  .quantity input.qty {
    background-color: var(--bg-card) !important;
    color: #ffffff !important;
    border: 1px solid var(--border-gold) !important;
  }

  /* Product Tabs */
  .woocommerce-tabs ul.tabs {
    background: var(--bg-card) !important;
    border-bottom: 1px solid var(--border-gold) !important;
  }
  .woocommerce-tabs ul.tabs li {
    background: var(--bg-surface) !important;
    border: 1px solid var(--border-subtle) !important;
    border-bottom: none !important;
  }
  .woocommerce-tabs ul.tabs li.active {
    background: var(--bg-card) !important;
    border-color: var(--gold-primary) !important;
  }
  .woocommerce-tabs ul.tabs li a {
    color: var(--text-secondary) !important;
    font-family: 'Cinzel', serif !important;
  }
  .woocommerce-tabs ul.tabs li.active a {
    color: var(--gold-primary) !important;
  }
  .woocommerce-tabs .panel {
    background: var(--bg-card) !important;
    border: 1px solid var(--border-gold) !important;
    border-top: none !important;
    padding: 2rem !important;
    color: var(--text-secondary) !important;
  }

  /* Cart & Checkout */
  .woocommerce-cart .cart_totals,
  .woocommerce-checkout #order_review,
  .woocommerce-checkout #customer_details {
    background: var(--bg-surface) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 12px !important;
    padding: 2rem !important;
    box-shadow: var(--shadow-luxury) !important;
  }
  table.shop_table {
    border: 1px solid var(--border-gold) !important;
    border-radius: 8px !important;
    background: var(--bg-card) !important;
    color: var(--text-primary) !important;
  }
  table.shop_table th {
    background: #0d1117 !important;
    color: var(--gold-primary) !important;
    font-family: 'Cinzel', serif !important;
    border-bottom: 1px solid var(--border-gold) !important;
  }
  table.shop_table td {
    border-top: 1px solid var(--border-subtle) !important;
    color: var(--text-secondary) !important;
  }
  table.shop_table tr.cart_item:hover {
    background-color: rgba(255, 255, 255, 0.02) !important;
  }

  /* Payment Gateway box */
  #payment {
    background: var(--bg-elevated) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 10px !important;
  }
  #payment ul.payment_methods {
    border-bottom: 1px solid var(--border-subtle) !important;
  }
  #payment div.payment_box {
    background: var(--bg-card) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 6px !important;
  }

  /* Notices */
  .woocommerce-message, .woocommerce-info {
    background-color: var(--bg-surface) !important;
    color: var(--text-primary) !important;
    border-top-color: var(--gold-primary) !important;
    box-shadow: var(--shadow-luxury) !important;
  }

  /* Floating WhatsApp Support Button */
  .wa-floating-concierge {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    color: #ffffff !important;
    text-decoration: none !important;
    padding: 12px 20px;
    border-radius: 50px;
    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4), 0 0 15px rgba(212, 175, 55, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .wa-floating-concierge:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 12px 30px rgba(37, 211, 102, 0.6), 0 0 25px rgba(212, 175, 55, 0.4);
    color: #ffffff !important;
  }
  .wa-floating-concierge svg {
    width: 24px;
    height: 24px;
    fill: #ffffff;
    flex-shrink: 0;
  }

  /* Site Footer */
  footer.site-footer, .ast-footer-overlay, #ast-footer {
    background-color: #040507 !important;
    border-top: 1px solid var(--border-gold) !important;
    color: var(--text-muted) !important;
  }
  footer.site-footer a {
    color: var(--gold-light) !important;
  }
  footer.site-footer a:hover {
    color: #ffffff !important;
  }
</style>
`;

  const footerCode = `
<!-- Reflection Elite Concierge Floating WhatsApp -->
<a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20am%20interested%20in%20your%20luxury%20mirrors." 
   target="_blank" 
   rel="noopener noreferrer" 
   class="wa-floating-concierge" 
   aria-label="Chat with Reflection Elite Concierge on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/>
  </svg>
  <span>Concierge Support</span>
</a>
`;

  // Submit form data
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', headerCode);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', footerCode);

  console.log('Sending update to WPCode...');
  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': allCookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  console.log('Save response status:', saveRes.status);
  console.log('Location header:', saveRes.headers.get('location'));
  console.log('Successfully injected Dark Luxury CSS & Floating WhatsApp button!');
}

injectDarkLuxury().catch(console.error);
