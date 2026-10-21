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

    target_id = 'id="re-why-choose-section"'
    if target_id not in content:
        raise RuntimeError('re-why-choose-section not found in Page 68!')

    # Find the section and replace only its background color
    sec_idx = content.find(target_id)
    style_start = content.find('<style', sec_idx)
    style_end = content.find('</style>', sec_idx)
    section_style = content[style_start:style_end]

    print('Current why-choose background in style:', '#383838' in section_style)

    if '#383838' in section_style:
        updated_style = section_style.replace('#383838', '#000000')
        content = content[:style_start] + updated_style + content[style_end:]
        print('Replacing #383838 with #000000 in #re-why-choose-section...')
    elif '#000000' in section_style:
        print('Already #000000 in style block.')
    else:
        # Fallback regex replace within the section
        content = re.sub(
            r'(#re-why-choose-section\s*\{[^}]*background-color:\s*)#[0-9a-fA-F]+(\s*!important;)',
            r'\g<1>#000000\g<2>',
            content,
            count=1
        )

    # Verify other critical elements are completely untouched
    has_video = 'id="re-craftsmanship-video-slider"' in content and 're-video-slide' in content
    has_crypto = 'id="re-crypto-announcement-banner"' in content
    has_delivery = 'HEAVY DELIVERY' in content or 'Heavy Delivery' in content

    print('Integrity check before saving:')
    print('  Craftsmanship video slider intact:', has_video)
    print('  Crypto banner intact:', has_crypto)
    print('  Heavy delivery text intact:', has_delivery)

    if not has_video or not has_crypto:
        raise RuntimeError('Integrity check failed! Aborting to prevent regressions.')

    # Save Page 68
    print('3. Saving Page 68...')
    save_res = session.post(f'{site_url}/wp-json/wp/v2/pages/68', json={'content': content}, headers={'X-WP-Nonce': nonce}, timeout=45)
    print('Save status:', save_res.status_code)

    # Purge Hostinger cache
    print('4. Purging Hostinger cache...')
    purge_res = session.delete(f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache', headers={'X-WP-Nonce': nonce}, timeout=20)
    print('Cache clear status:', purge_res.status_code)

    # Verify live
    print('5. Verifying live site...')
    live = session.get(f'{site_url}/?verify={os.urandom(4).hex()}', timeout=30).text
    m = re.search(r'#re-why-choose-section\s*\{[^}]*background-color:\s*([^;!]+)', live)
    bg_live = m.group(1).strip() if m else 'unknown'
    print(f'Live Why Choose background color: {bg_live}')

if __name__ == '__main__':
    main()
