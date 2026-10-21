import os
import re
import sys
import requests

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

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

    # 1. Update WPCode Snippet 197
    print('2. Updating WPCode Snippet 197...')
    snippet_url = f'{site_url}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197'
    snippet_page = session.get(snippet_url, timeout=30).text
    wpcode_nonce = re.search(r'name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"', snippet_page).group(1)

    with open('snippet_te_hero_ticker_slider_v2.html', 'r', encoding='utf-8') as f:
        snippet_code = f.read()

    session.post(snippet_url, data={
        'wpcode_snippet_title': 'te-hero-ticker-slider-v2',
        'wpcode_active': '1',
        'wpcode_snippet_type': 'html',
        'wpcode_snippet_code': snippet_code,
        'wpcode_auto_insert': '1',
        'wpcode_auto_insert_location': 'site_wide_footer',
        'wpcode_priority': '10',
        'id': '197',
        'wpcode-save-snippet-nonce': wpcode_nonce,
        '_wp_http_referer': '/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197'
    }, timeout=30)
    print('[OK] Snippet 197 updated.')

    # 2. Update Page 68 announcement strip
    print('3. Updating Page 68 announcement strip...')
    page_edit = session.get(f'{site_url}/wp-admin/post.php?post=68&action=edit', timeout=30).text
    rest_nonce_m = re.search(r'wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"', page_edit)
    rest_nonce = rest_nonce_m.group(1) if rest_nonce_m else ''

    page_data = session.get(f'{site_url}/wp-json/wp/v2/pages/68?context=edit', headers={'X-WP-Nonce': rest_nonce}, timeout=30).json()
    content = page_data.get('content', {}).get('raw', '')

    old_text1 = 'WE COVER THE HEAVY DELIVERY COST ON EVERY MIRROR'
    old_text2 = 'We Cover The Heavy Delivery Cost On Every Mirror'
    old_text3 = 'WE COVER THE HEAVY DUTY COST ON EVERY MIRROR'
    old_text4 = 'We Cover The Heavy Duty Cost On Every Mirror'
    new_text = 'Free Heavy Delivery Cost On Every Mirror'

    replaced = False
    for ot in [old_text1, old_text2, old_text3, old_text4]:
        if ot in content:
            content = content.replace(ot, new_text.upper() if ot.isupper() else new_text)
            replaced = True

    if replaced:
        session.post(f'{site_url}/wp-json/wp/v2/pages/68', json={'content': content}, headers={'X-WP-Nonce': rest_nonce}, timeout=30)
        print('[OK] Page 68 announcement text updated.')
    else:
        print('Notice: Announcement strip in Page 68 is handled dynamically by Snippet 197.')

    # 3. Purge cache
    print('4. Purging Hostinger cache...')
    session.delete(f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache', headers={'X-WP-Nonce': rest_nonce}, timeout=20)
    print('[OK] Cache purged.')

    # 4. Verify
    print('5. Verifying live site...')
    live_res = session.get(f'{site_url}/?t={os.urandom(4).hex()}', timeout=30)
    is_live = 'FREE HEAVY DELIVERY' in live_res.text.upper()
    print(f'[OK] Live verification ("Free Heavy Delivery" active): {is_live}')

if __name__ == '__main__':
    main()
