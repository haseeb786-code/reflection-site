import os
import re
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

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

def get_session():
    s = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retries)
    s.mount('https://', adapter)
    s.mount('http://', adapter)
    s.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
    return s

def main():
    env = load_env()
    site_url = env.get('PROD_WP_URL', 'https://reflectionelite.com').rstrip('/')
    username = env.get('PROD_WP_USER')
    password = env.get('PROD_WP_PASS')

    session = get_session()

    print('1. Authenticating to WordPress...')
    for attempt in range(3):
        try:
            time.sleep(1)
            session.post(f'{site_url}/wp-login.php', data={
                'log': username,
                'pwd': password,
                'wp-submit': 'Log In',
                'redirect_to': f'{site_url}/wp-admin/',
                'testcookie': '1'
            }, timeout=30)
            break
        except Exception as e:
            print(f'Login attempt {attempt+1} failed: {e}. Retrying in 2s...')
            time.sleep(2)

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

    with open('backups/page_68_before_social_links_fix.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Backup saved to backups/page_68_before_social_links_fix.html')

    # Replace social links with exact Shopify profiles
    updated_content = content.replace(
        'href="https://facebook.com/"',
        'href="https://www.facebook.com/ReflectionElite"'
    ).replace(
        'href="https://instagram.com/"',
        'href="https://www.instagram.com/reflectionelite/"'
    )

    # Pre-save assertions
    has_fb = 'https://www.facebook.com/ReflectionElite' in updated_content
    has_ig = 'https://www.instagram.com/reflectionelite/' in updated_content
    has_video = 'id="re-craftsmanship-video-slider"' in updated_content and 're-video-slide' in updated_content
    has_crypto = 'id="re-crypto-announcement-banner"' in updated_content
    has_why_choose = 'id="re-why-choose-section"' in updated_content and '#000000' in updated_content
    has_slideshow = 'id="re-slideshow-new-arrivals"' in updated_content and 'intervalMs = 4000;' in updated_content
    has_faq = 'id="re-faq-section"' in updated_content
    has_shipping = 'SHIPPING POLICY' in updated_content and 'shipping-policy' in updated_content
    has_terms = 'TERMS OF SERVICE' in updated_content and 'terms-of-service' in updated_content
    has_contact = 'CONTACT INFORMATION' in updated_content and '/contact/' in updated_content

    print('Integrity checks:')
    print('  Exact Shopify Facebook link present:', has_fb)
    print('  Exact Shopify Instagram link present:', has_ig)
    print('  Craftsmanship video slider intact:', has_video)
    print('  Crypto banner intact:', has_crypto)
    print('  Why Choose section with #000000 intact:', has_why_choose)
    print('  Slideshow 4s autoplay intact:', has_slideshow)
    print('  FAQ section intact:', has_faq)
    print('  Shipping Policy in footer:', has_shipping)
    print('  Terms of Service in footer:', has_terms)
    print('  Contact Information in footer:', has_contact)

    if not (has_fb and has_ig and has_video and has_crypto and has_why_choose and has_slideshow and has_faq and has_shipping and has_terms and has_contact):
        raise RuntimeError('Pre-save integrity checks failed! Aborting update.')

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
    live_fb = 'https://www.facebook.com/ReflectionElite' in live
    live_ig = 'https://www.instagram.com/reflectionelite/' in live
    print(f'Live FB verified: {live_fb}')
    print(f'Live IG verified: {live_ig}')

if __name__ == '__main__':
    main()
