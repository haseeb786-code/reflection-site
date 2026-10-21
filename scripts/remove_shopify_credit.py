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

    print(f'Connecting to {site_url}...')
    login_res = session.post(f'{site_url}/wp-login.php', data={
        'log': username,
        'pwd': password,
        'wp-submit': 'Log In',
        'redirect_to': f'{site_url}/wp-admin/',
        'testcookie': '1'
    }, timeout=30)
    print('Login HTTP status:', login_res.status_code)

    # Fetch nonce
    page_edit = session.get(f'{site_url}/wp-admin/post.php?post=68&action=edit', timeout=30).text
    nonce_m = re.search(r'wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"', page_edit)
    if not nonce_m:
        nonce_m = re.search(r'"nonce":"([a-f0-9]{10})"', page_edit)
    nonce = nonce_m.group(1) if nonce_m else ''
    print('WP API Nonce found:', bool(nonce))

    # Fetch current content of Page 68
    page_res = session.get(f'{site_url}/wp-json/wp/v2/pages/68?context=edit', headers={'X-WP-Nonce': nonce}, timeout=30)
    if page_res.status_code != 200:
        print('Error fetching page 68:', page_res.text[:300])
        return

    page_data = page_res.json()
    content = page_data.get('content', {}).get('raw', '')

    target_pattern = r'(&copy;\s*2026\s*REFLECTION\s*ELITE)(,\s*POWERED BY SHOPIFY)?'
    
    # Check if POWERED BY SHOPIFY is in content
    if 'POWERED BY SHOPIFY' not in content:
        print('Notice: POWERED BY SHOPIFY not found in Page 68 raw content!')
    else:
        print('Found POWERED BY SHOPIFY in content. Removing it...')
        # Replace variations like:
        # &copy; 2026 REFLECTION ELITE, POWERED BY SHOPIFY -> &copy; 2026 REFLECTION ELITE
        # © 2026 REFLECTION ELITE, POWERED BY SHOPIFY -> © 2026 REFLECTION ELITE
        new_content = content.replace(', POWERED BY SHOPIFY', '')
        new_content = new_content.replace('POWERED BY SHOPIFY', '')

        # Save updated content
        print('Updating Page 68...')
        save_res = session.post(
            f'{site_url}/wp-json/wp/v2/pages/68',
            json={'content': new_content},
            headers={'X-WP-Nonce': nonce},
            timeout=45
        )
        print('Save HTTP status:', save_res.status_code)
        if save_res.status_code == 200:
            print('Successfully updated Page 68!')
        else:
            print('Save error:', save_res.text[:300])

    # Clear Hostinger Cache
    print('Purging Hostinger Cache...')
    try:
        purge_res = session.delete(
            f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache',
            headers={'X-WP-Nonce': nonce},
            timeout=20
        )
        print('Cache purge status:', purge_res.status_code)
    except Exception as e:
        print('Cache purge error:', e)

    # Verify live page
    print('Verifying live homepage...')
    live_res = session.get(f'{site_url}/?verify={os.urandom(4).hex()}', timeout=30)
    has_shopify = 'POWERED BY SHOPIFY' in live_res.text
    print('Is POWERED BY SHOPIFY still in live HTML?:', has_shopify)
    if not has_shopify:
        print('VERIFICATION PASSED: POWERED BY SHOPIFY has been successfully removed!')
    else:
        print('WARNING: It is still showing in live HTML, checking why...')

if __name__ == '__main__':
    main()
