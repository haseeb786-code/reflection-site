import os
import re
import json
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

    # 1. Update Page 68 announcement strip
    print('2. Fetching Page 68...')
    page_edit = session.get(f'{site_url}/wp-admin/post.php?post=68&action=edit', timeout=30).text
    rest_nonce_m = re.search(r'wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"', page_edit)
    if not rest_nonce_m:
        rest_nonce_m = re.search(r'"nonce":"([a-f0-9]{10})"', page_edit)
    rest_nonce = rest_nonce_m.group(1) if rest_nonce_m else ''

    page_data = session.get(f'{site_url}/wp-json/wp/v2/pages/68?context=edit', headers={'X-WP-Nonce': rest_nonce}, timeout=30).json()
    content = page_data.get('content', {}).get('raw', '')

    print('Has DUTY in content?', 'DUTY' in content or 'Duty' in content)

    old_text1 = 'WE COVER THE HEAVY DUTY COST ON EVERY MIRROR'
    old_text2 = 'We Cover The Heavy Duty Cost On Every Mirror'
    new_text = 'WE COVER THE HEAVY DELIVERY COST ON EVERY MIRROR'

    if old_text1 in content or old_text2 in content:
        content = content.replace(old_text1, new_text)
        content = content.replace(old_text2, new_text)
        save_res = session.post(f'{site_url}/wp-json/wp/v2/pages/68', json={'content': content}, headers={'X-WP-Nonce': rest_nonce}, timeout=45)
        print('✓ Page 68 saved with HTTP:', save_res.status_code)
    else:
        print('Announcement strip in Page 68 already updated or rendered via Snippet 197.')

    # 2. Purge Hostinger cache
    print('3. Purging Hostinger cache...')
    purge_res = session.delete(f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache', headers={'X-WP-Nonce': rest_nonce}, timeout=20)
    print('✓ Cache purged with HTTP:', purge_res.status_code)

    # 3. Verify Live Site
    print('4. Verifying live site...')
    live_res = session.get(f'{site_url}/?t={os.urandom(4).hex()}', timeout=30)
    has_delivery = 'HEAVY DELIVERY' in live_res.text.upper() or 'heavy delivery' in live_res.text.lower()
    print(f'✓ Live verification ("Heavy Delivery" active): {has_delivery}')

if __name__ == '__main__':
    main()
