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

    target_sec = 'id="re-slideshow-new-arrivals"'
    if target_sec not in content:
        raise RuntimeError('re-slideshow-new-arrivals not found in Page 68!')

    # Look for intervalMs in content
    if 'intervalMs = 6000;' not in content:
        # Check what intervalMs is currently
        m = re.search(r'intervalMs\s*=\s*(\d+);', content)
        if m:
            print(f'Found current intervalMs: {m.group(1)}')
            content = re.sub(r'intervalMs\s*=\s*\d+;', 'intervalMs = 4000;', content, count=1)
        else:
            raise RuntimeError('intervalMs timer variable not found in Page 68!')
    else:
        print('Found intervalMs = 6000; Replacing with intervalMs = 4000;...')
        content = content.replace('intervalMs = 6000;', 'intervalMs = 4000;', 1)

    # Pre-save safety checks
    has_video = 'id="re-craftsmanship-video-slider"' in content and 're-video-slide' in content
    has_crypto = 'id="re-crypto-announcement-banner"' in content
    has_why_choose = 'id="re-why-choose-section"' in content
    has_slideshow = 'id="re-slideshow-new-arrivals"' in content and 'intervalMs = 4000;' in content

    print('Safety checks:')
    print('  Video slider intact:', has_video)
    print('  Crypto banner intact:', has_crypto)
    print('  Why choose section intact:', has_why_choose)
    print('  Slideshow with 4000ms intact:', has_slideshow)

    if not (has_video and has_crypto and has_why_choose and has_slideshow):
        raise RuntimeError('Pre-save integrity checks failed! Aborting update.')

    # Save Page 68
    print('3. Saving Page 68...')
    save_res = session.post(f'{site_url}/wp-json/wp/v2/pages/68', json={'content': content}, headers={'X-WP-Nonce': nonce}, timeout=45)
    print('Save HTTP status:', save_res.status_code)
    if save_res.status_code != 200:
        raise RuntimeError(f'Save failed with status {save_res.status_code}: {save_res.text[:200]}')

    # Purge Hostinger cache
    print('4. Purging Hostinger cache...')
    purge_res = session.delete(f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache', headers={'X-WP-Nonce': nonce}, timeout=20)
    print('Cache clear HTTP status:', purge_res.status_code)

    # Verify live site
    print('5. Verifying live site...')
    live = session.get(f'{site_url}/?verify={os.urandom(4).hex()}', timeout=30).text
    has_4000 = 'intervalMs = 4000;' in live
    print('Live site has intervalMs = 4000:', has_4000)

if __name__ == '__main__':
    main()
