import os
import re
import requests

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

NEW_SHOPIFY_FOOTER_HTML = '''
<!-- ===================================================================== -->
<!-- SHOPIFY ATELIER EXACT REPLICA: LUXURY FOOTER                          -->
<!-- ===================================================================== -->
<footer id="re-shopify-atelier-footer" class="re-shopify-atelier-footer">
  <style>
    #re-shopify-atelier-footer {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      color: #ffffff !important;
      padding: 75px 0 35px 0 !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
      font-family: 'Montserrat', -apple-system, sans-serif !important;
      z-index: 5;
    }

    #re-shopify-atelier-footer * {
      box-sizing: border-box;
    }

    #re-shopify-atelier-footer .re-footer-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 40px;
    }

    #re-shopify-atelier-footer .re-footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1.2fr 1fr;
      gap: 50px;
      margin-bottom: 60px;
    }

    #re-shopify-atelier-footer .re-footer-col-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 24px 0;
    }

    #re-shopify-atelier-footer .re-footer-link-list {
      list-style: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    #re-shopify-atelier-footer .re-footer-link-item {
      margin-bottom: 14px !important;
      list-style: none !important;
    }

    #re-shopify-atelier-footer .re-footer-link {
      font-family: 'Montserrat', -apple-system, sans-serif !important;
      font-size: 12.5px !important;
      font-weight: 500 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255, 255, 255, 0.72) !important;
      text-decoration: none !important;
      transition: color 0.25s ease, transform 0.25s ease !important;
      display: inline-block !important;
    }

    #re-shopify-atelier-footer .re-footer-link:hover {
      color: #d4a574 !important;
      transform: translateX(3px) !important;
    }

    #re-shopify-atelier-footer .re-footer-social-icons {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    #re-shopify-atelier-footer .re-footer-social-link {
      color: rgba(255, 255, 255, 0.75) !important;
      transition: color 0.25s ease, transform 0.25s ease !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-decoration: none !important;
    }

    #re-shopify-atelier-footer .re-footer-social-link:hover {
      color: #ffffff !important;
      transform: scale(1.15) !important;
    }

    #re-shopify-atelier-footer .re-footer-brand-center {
      text-align: center;
      margin: 0 auto 50px auto;
    }

    #re-shopify-atelier-footer .re-footer-brand-logo {
      max-height: 48px;
      width: auto;
      display: inline-block;
      filter: brightness(1.1);
    }

    #re-shopify-atelier-footer .re-footer-bottom-bar {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 11.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
    }

    #re-shopify-atelier-footer .re-footer-bottom-bar a {
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      transition: color 0.25s ease;
    }

    #re-shopify-atelier-footer .re-footer-bottom-bar a:hover {
      color: #d4a574;
    }

    @media (max-width: 768px) {
      #re-shopify-atelier-footer {
        padding: 55px 0 30px 0 !important;
      }
      #re-shopify-atelier-footer .re-footer-container {
        padding: 0 24px;
      }
      #re-shopify-atelier-footer .re-footer-grid {
        grid-template-columns: 1fr;
        gap: 36px;
        margin-bottom: 45px;
      }
      #re-shopify-atelier-footer .re-footer-bottom-bar {
        flex-direction: column;
        text-align: center;
        gap: 14px;
      }
    }
  </style>

  <div class="re-footer-container">
    <div class="re-footer-grid">
      <!-- COLUMN 1: SHOP -->
      <div class="re-footer-col">
        <h4 class="re-footer-col-title">SHOP</h4>
        <ul class="re-footer-link-list">
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/shop/" class="re-footer-link" onclick="if(window.reToggleSearch){window.reToggleSearch(event);return false;}">SEARCH</a></li>
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/privacy-policy-2/" class="re-footer-link">PRIVACY POLICY</a></li>
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/refund_returns-2/" class="re-footer-link">REFUND POLICY</a></li>
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/shipping-policy/" class="re-footer-link">SHIPPING POLICY</a></li>
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/terms-of-service/" class="re-footer-link">TERMS OF SERVICE</a></li>
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/contact/" class="re-footer-link">CONTACT INFORMATION</a></li>
        </ul>
      </div>

      <!-- COLUMN 2: ABOUT US -->
      <div class="re-footer-col">
        <h4 class="re-footer-col-title">ABOUT US</h4>
        <ul class="re-footer-link-list">
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/my-account/orders/" class="re-footer-link">ORDERS</a></li>
          <li class="re-footer-link-item"><a href="https://reflectionelite.com/my-account/edit-account/" class="re-footer-link">PROFILE</a></li>
        </ul>
      </div>

      <!-- COLUMN 3: CONNECT -->
      <div class="re-footer-col">
        <h4 class="re-footer-col-title">CONNECT</h4>
        <div class="re-footer-social-icons">
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" class="re-footer-social-link" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" class="re-footer-social-link" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Centered Brand Logo -->
    <div class="re-footer-brand-center">
      <a href="https://reflectionelite.com/">
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/reflection_elite_gold_logo.png" alt="Reflection Elite" class="re-footer-brand-logo">
      </a>
    </div>

    <!-- Bottom Bar -->
    <div class="re-footer-bottom-bar">
      <div>&copy; 2026 REFLECTION ELITE</div>
      <div><a href="https://reflectionelite.com/terms-of-service/">TERMS AND POLICIES</a></div>
      <div class="re-footer-social-icons">
        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" class="re-footer-social-link" aria-label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" class="re-footer-social-link" aria-label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" class="re-footer-social-link" aria-label="TikTok">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
        </a>
        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" class="re-footer-social-link" aria-label="X (Twitter)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
      </div>
    </div>
  </div>
</footer>
'''

def main():
    env = load_env()
    site_url = env.get('PROD_WP_URL', 'https://reflectionelite.com').rstrip('/')
    username = env.get('PROD_WP_USER')
    password = env.get('PROD_WP_PASS')

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })

    print('1. Authenticating to WordPress...')
    session.post(f'{site_url}/wp-login.php', data={
        'log': username,
        'pwd': password,
        'wp-submit': 'Log In',
        'redirect_to': f'{site_url}/wp-admin/',
        'testcookie': '1'
    }, timeout=30)

    # Fetch nonce
    page_edit = session.get(f'{site_url}/wp-admin/post.php?post=68&action=edit', timeout=30).text
    nonce_m = re.search(r'wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"', page_edit)
    if not nonce_m:
        nonce_m = re.search(r'"nonce":"([a-f0-9]{10})"', page_edit)
    nonce = nonce_m.group(1) if nonce_m else ''

    # Fetch latest live Page 68
    print('2. Fetching latest live Page 68...')
    page_data = session.get(f'{site_url}/wp-json/wp/v2/pages/68?context=edit', headers={'X-WP-Nonce': nonce}, timeout=30).json()
    content = page_data.get('content', {}).get('raw', '')

    # Save backup before mutation
    with open('backups/page_68_before_shopify_footer.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Backup saved to backups/page_68_before_shopify_footer.html')

    footer_start = content.find('<footer')
    if footer_start == -1:
        raise RuntimeError('Could not find <footer in Page 68!')

    footer_end = content.find('</footer>', footer_start)
    if footer_end == -1:
        raise RuntimeError('Could not find closing </footer> in Page 68!')
    footer_end += len('</footer>')

    print(f'Replacing footer from character index {footer_start} to {footer_end}...')
    updated_content = content[:footer_start] + NEW_SHOPIFY_FOOTER_HTML.strip() + content[footer_end:]

    # Rigorous pre-save integrity checks
    has_video = 'id="re-craftsmanship-video-slider"' in updated_content and 're-video-slide' in updated_content
    has_crypto = 'id="re-crypto-announcement-banner"' in updated_content
    has_why_choose = 'id="re-why-choose-section"' in updated_content and '#000000' in updated_content
    has_slideshow = 'id="re-slideshow-new-arrivals"' in updated_content and 'intervalMs = 4000;' in updated_content
    has_faq = 'id="re-faq-section"' in updated_content
    has_shipping = 'SHIPPING POLICY' in updated_content and 'shipping-policy' in updated_content
    has_terms = 'TERMS OF SERVICE' in updated_content and 'terms-of-service' in updated_content
    has_contact = 'CONTACT INFORMATION' in updated_content and '/contact/' in updated_content

    print('Integrity checks:')
    print('  Craftsmanship video slider intact:', has_video)
    print('  Crypto banner intact:', has_crypto)
    print('  Why Choose section with #000000 intact:', has_why_choose)
    print('  Slideshow 4s autoplay intact:', has_slideshow)
    print('  FAQ section intact:', has_faq)
    print('  Shipping Policy in footer:', has_shipping)
    print('  Terms of Service in footer:', has_terms)
    print('  Contact Information in footer:', has_contact)

    if not (has_video and has_crypto and has_why_choose and has_slideshow and has_faq and has_shipping and has_terms and has_contact):
        raise RuntimeError('Pre-save integrity checks failed! Aborting to prevent regressions.')

    # Save Page 68
    print('3. Saving Page 68...')
    save_res = session.post(f'{site_url}/wp-json/wp/v2/pages/68', json={'content': updated_content}, headers={'X-WP-Nonce': nonce}, timeout=45)
    print('Save HTTP status:', save_res.status_code)
    if save_res.status_code != 200:
        raise RuntimeError(f'Save failed: {save_res.text[:200]}')

    # Purge Hostinger cache
    print('4. Purging Hostinger cache...')
    purge_res = session.delete(f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache', headers={'X-WP-Nonce': nonce}, timeout=20)
    print('Cache clear HTTP status:', purge_res.status_code)

    # Verify live site
    print('5. Verifying live site...')
    live = session.get(f'{site_url}/?verify={os.urandom(4).hex()}', timeout=30).text
    print('Live has re-shopify-atelier-footer:', 're-shopify-atelier-footer' in live)
    print('Live has SHIPPING POLICY link:', 'shipping-policy' in live)
    print('Live has TERMS OF SERVICE link:', 'terms-of-service' in live)
    print('Live has CONTACT INFORMATION link:', 'CONTACT INFORMATION' in live)

if __name__ == '__main__':
    main()
