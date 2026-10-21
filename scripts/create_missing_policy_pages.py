import os, re, requests

def load_env():
    env = {}
    if os.path.exists('.env'):
        with open('.env', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip()
    return env

env = load_env()
site_url = env.get('PROD_WP_URL', 'https://reflectionelite.com').rstrip('/')
u = env.get('PROD_WP_USER')
p = env.get('PROD_WP_PASS')

s = requests.Session()
s.headers.update({'User-Agent': 'Mozilla/5.0'})
s.post(f'{site_url}/wp-login.php', data={'log': u, 'pwd': p, 'wp-submit': 'Log In', 'testcookie': '1'})
page_edit = s.get(f'{site_url}/wp-admin/post.php?post=68&action=edit', timeout=30).text
nonce_m = re.search(r'wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"', page_edit)
nonce = nonce_m.group(1) if nonce_m else ''

pages_to_create = [
    {
        'title': 'Shipping & Delivery Policy',
        'slug': 'shipping-policy',
        'content': '''
<div class="policy-wrapper">
  <div class="re-policy-page-wrapper">
    <div class="re-policy-hero">
      <div class="re-catalog-breadcrumb">HOME / SHIPPING &amp; DELIVERY POLICY</div>
      <div class="re-sub-title-accent">&mdash; LUXURY FRAGILE FREIGHT &amp; TRANSIT &mdash;</div>
      <h1 class="re-policy-title">Shipping &amp; Delivery Policy</h1>
      <div class="re-gold-divider-mini"></div>
      <p class="re-policy-hero-sub">Our commitment to reinforced crating and safe transit for every handcrafted mirror.</p>
    </div>

    <div class="re-policy-card">
      <p class="re-policy-lead"><strong class="re-dark-accent">Reflection Elite</strong> provides specialized pan-India fragile freight delivery for all handcrafted and bespoke architectural mirrors.</p>

      <h2 class="re-policy-heading">1. Domestic Shipping Coverage</h2>
      <p class="re-policy-text">Reflection Elite delivers handcrafted luxury mirrors pan-India to all serviceable pincodes across metro cities and tier 1/2/3 towns through specialized fragile freight logistics partners (Blue Dart, Delhivery, Safechem Fragile Cargo).</p>

      <h2 class="re-policy-heading">2. Reinforced Wooden Crate Packaging</h2>
      <p class="re-policy-text">To prevent glass breakage, every Reflection Elite mirror undergoes an intensive 4-layer packaging process:</p>
      <ul class="re-policy-list">
        <li>Anti-scratch bubble wrap and high-density foam edge protectors.</li>
        <li>High-density shock-absorbing thermocol cushions.</li>
        <li>Heavy-duty 5-ply corrugated inner container.</li>
        <li>Outer reinforced wooden crate bolted for maximum transit security.</li>
      </ul>

      <h2 class="re-policy-heading">3. Order Processing &amp; Dispatch Timelines</h2>
      <ul class="re-policy-list">
        <li><strong>In-Stock Mirrors:</strong> Dispatched within 2 to 4 business days.</li>
        <li><strong>Handcrafted / Bespoke Made-to-Order Mirrors:</strong> Hand-assembled, inspected, and dispatched within 7 to 10 business days.</li>
        <li>Customers receive live tracking updates as soon as the wooden crate is handed over to the courier partner.</li>
      </ul>

      <h2 class="re-policy-heading">4. Transit Timelines</h2>
      <ul class="re-policy-list">
        <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 3 to 6 business days after dispatch.</li>
        <li><strong>Rest of India:</strong> 5 to 9 business days after dispatch.</li>
      </ul>

      <h2 class="re-policy-heading">5. Shipping Charges</h2>
      <p class="re-policy-text">We cover the heavy delivery cost on every mirror. Any applicable local octroi or state entry permits for oversized freight are coordinated directly by our dispatch team.</p>

      <h2 class="re-policy-heading">Atelier Concierge Contact</h2>
      <p class="re-policy-text">For questions regarding shipping or custom dimension surveys, contact our atelier team:</p>
      <div class="re-policy-atelier-box">
        <strong class="re-dark-accent">Reflection Elite</strong><br>
        Email: <a href="mailto:reflectionelite.com@gmail.com" class="re-gold-link">reflectionelite.com@gmail.com</a><br>
        Direct Atelier Concierge: <a href="https://wa.me/917387463103" class="re-gold-link"><strong>+91 7387463103</strong></a>
      </div>
    </div>
  </div>
</div>
'''
    },
    {
        'title': 'Terms of Service',
        'slug': 'terms-of-service',
        'content': '''
<div class="policy-wrapper">
  <div class="re-policy-page-wrapper">
    <div class="re-policy-hero">
      <div class="re-catalog-breadcrumb">HOME / TERMS OF SERVICE</div>
      <div class="re-sub-title-accent">&mdash; CLIENT TERMS &amp; CONDITIONS &mdash;</div>
      <h1 class="re-policy-title">Terms of Service</h1>
      <div class="re-gold-divider-mini"></div>
      <p class="re-policy-hero-sub">Terms governing purchases, artisanal characteristics, and customer care.</p>
    </div>

    <div class="re-policy-card">
      <p class="re-policy-lead">By accessing or purchasing from <strong class="re-dark-accent">Reflection Elite</strong> ("we", "us", or "our"), you agree to be bound by these Terms of Service and our Privacy and Shipping Policies.</p>

      <h2 class="re-policy-heading">1. Product Authenticity &amp; Handcrafted Characteristics</h2>
      <p class="re-policy-text">Each mirror created by Reflection Elite is individually handcrafted by skilled artisans. Minor natural variations in glass bevelling, antique tinting, frame woodwork, or patina are authentic hallmarks of artisanal production and are not considered manufacturing defects.</p>

      <h2 class="re-policy-heading">2. Pricing &amp; Taxes</h2>
      <p class="re-policy-text">All prices displayed on the store are in Indian Rupees (INR / &#8377;). Prices include applicable Goods and Services Tax (GST) unless explicitly indicated otherwise during the checkout summary.</p>

      <h2 class="re-policy-heading">3. Payment Methods &amp; Security</h2>
      <p class="re-policy-text">Payments are processed securely via authorized payment gateways (supporting UPI, Debit Cards, Credit Cards, NetBanking, and Wallets) as well as Cryptocurrency. Reflection Elite does not store or process raw payment credentials or banking passwords.</p>

      <h2 class="re-policy-heading">4. Intellectual Property</h2>
      <p class="re-policy-text">All product designs, photography, brand logos, product descriptions, and site copy are the exclusive intellectual property of Reflection Elite and may not be reproduced without written consent.</p>

      <h2 class="re-policy-heading">5. Governing Law &amp; Jurisdiction</h2>
      <p class="re-policy-text">These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts.</p>

      <h2 class="re-policy-heading">Atelier Concierge Contact</h2>
      <p class="re-policy-text">For inquiries regarding our terms, reach out to our concierge:</p>
      <div class="re-policy-atelier-box">
        <strong class="re-dark-accent">Reflection Elite</strong><br>
        Email: <a href="mailto:reflectionelite.com@gmail.com" class="re-gold-link">reflectionelite.com@gmail.com</a><br>
        Direct Atelier Concierge: <a href="https://wa.me/917387463103" class="re-gold-link"><strong>+91 7387463103</strong></a>
      </div>
    </div>
  </div>
</div>
'''
    }
]

for pdata in pages_to_create:
    existing = s.get(f'{site_url}/wp-json/wp/v2/pages?slug={pdata["slug"]}&status=any', headers={'X-WP-Nonce': nonce}).json()
    if existing:
        page_id = existing[0]['id']
        print(f"Updating existing page {pdata['slug']} (ID: {page_id})...")
        res = s.post(
            f'{site_url}/wp-json/wp/v2/pages/{page_id}',
            json={'title': pdata['title'], 'content': pdata['content'], 'status': 'publish'},
            headers={'X-WP-Nonce': nonce}
        )
    else:
        print(f"Creating new page {pdata['slug']}...")
        res = s.post(
            f'{site_url}/wp-json/wp/v2/pages',
            json={'title': pdata['title'], 'slug': pdata['slug'], 'content': pdata['content'], 'status': 'publish'},
            headers={'X-WP-Nonce': nonce}
        )
    print(f"Result for {pdata['slug']}: status={res.status_code}")
