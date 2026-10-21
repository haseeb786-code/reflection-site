import os, re, requests
from fix_social_urls import load_env, get_session

env = load_env()
site_url = env.get('PROD_WP_URL', 'https://reflectionelite.com').rstrip('/')
u = env.get('PROD_WP_USER')
p = env.get('PROD_WP_PASS')

session = get_session()
session.post(f'{site_url}/wp-login.php', data={
    'log': u, 'pwd': p, 'wp-submit': 'Log In', 'testcookie': '1'
}, timeout=30)

page_edit = session.get(f'{site_url}/wp-admin/post.php?post=68&action=edit', timeout=30).text
nonce_m = re.search(r'wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"', page_edit)
if not nonce_m:
    nonce_m = re.search(r'"nonce":"([a-f0-9]{10})"', page_edit)
nonce = nonce_m.group(1) if nonce_m else ''

page_data = session.get(f'{site_url}/wp-json/wp/v2/pages/68?context=edit', headers={'X-WP-Nonce': nonce}, timeout=30).json()
content = page_data.get('content', {}).get('raw', '')

# Remove tiktok and x placeholders from bottom bar if present
updated_content = re.sub(r'<a\s+href="https://tiktok\.com/"[^>]*>[\s\S]*?</a>\s*', '', content)
updated_content = re.sub(r'<a\s+href="https://x\.com/"[^>]*>[\s\S]*?</a>\s*', '', updated_content)

# Integrity checks
assert 'https://www.facebook.com/ReflectionElite' in updated_content
assert 'https://www.instagram.com/reflectionelite/' in updated_content
assert 'id="re-craftsmanship-video-slider"' in updated_content
assert 'id="re-crypto-announcement-banner"' in updated_content
assert '#000000' in updated_content
assert 'intervalMs = 4000;' in updated_content

save_res = session.post(f'{site_url}/wp-json/wp/v2/pages/68', json={'content': updated_content}, headers={'X-WP-Nonce': nonce}, timeout=45)
print('Save HTTP status:', save_res.status_code)

purge_res = session.delete(f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache', headers={'X-WP-Nonce': nonce}, timeout=20)
print('Cache clear HTTP status:', purge_res.status_code)
