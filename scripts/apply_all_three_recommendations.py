import os
import re
import sys
import json
import requests
from urllib.parse import urljoin

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

    if not username or not password:
        raise ValueError('Missing PROD_WP_USER or PROD_WP_PASS in .env')

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })

    print(f'1. Authenticating to WordPress ({site_url})...')
    login_url = f'{site_url}/wp-login.php'
    login_res = session.post(login_url, data={
        'log': username,
        'pwd': password,
        'wp-submit': 'Log In',
        'redirect_to': f'{site_url}/wp-admin/',
        'testcookie': '1'
    }, timeout=30)

    admin_res = session.get(f'{site_url}/wp-admin/index.php', timeout=30)
    if 'wp-admin' not in admin_res.url and 'howdy' not in admin_res.text.lower():
        raise RuntimeError('Failed to log in to WordPress admin.')
    print('[OK] Successfully logged in to WordPress Admin.')

    # =========================================================================
    # STEP 1: DEPLOY WPCODE SNIPPET 197 (Agent 3 Task)
    # =========================================================================
    print('\n============================================================')
    print('STEP 1: Updating WPCode Snippet 197 (Marquee Ticker Wording)')
    print('============================================================')
    snippet_url = f'{site_url}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197'
    snippet_page_res = session.get(snippet_url, timeout=30)
    if snippet_page_res.status_code != 200:
        raise RuntimeError(f'Failed to fetch snippet 197 page: HTTP {snippet_page_res.status_code}')

    wpcode_nonce_match = re.search(r'name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"', snippet_page_res.text)
    if not wpcode_nonce_match:
        raise RuntimeError('Could not find wpcode-save-snippet-nonce on snippet edit page')
    wpcode_nonce = wpcode_nonce_match.group(1)
    print(f'[OK] Found WPCode save nonce: {wpcode_nonce}')

    with open('snippet_te_hero_ticker_slider_v2.html', 'r', encoding='utf-8') as f:
        snippet_code = f.read()

    save_snippet_data = {
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
    }

    save_snippet_res = session.post(snippet_url, data=save_snippet_data, timeout=30, allow_redirects=True)
    print(f'Snippet save response status: {save_snippet_res.status_code}')

    # Verify snippet 197 on admin
    verify_snippet_res = session.get(snippet_url, timeout=30)
    if 'WE COVER THE HEAVY DUTY COST ON EVERY MIRROR' in verify_snippet_res.text:
        print('[OK] WPCode Snippet 197 verified: Contains "WE COVER THE HEAVY DUTY COST ON EVERY MIRROR"!')
    else:
        print('[WARN] Snippet 197 verification text not found directly in edit preview.')

    # =========================================================================
    # STEP 2: FETCH CURRENT PAGE 68 & PREPARE UNIFIED UPDATES
    # =========================================================================
    print('\n============================================================')
    print('STEP 2: Fetching Current Page 68 Content')
    print('============================================================')
    
    page_edit_url = f'{site_url}/wp-admin/post.php?post=68&action=edit'
    page_edit_res = session.get(page_edit_url, timeout=30)
    page_edit_nonce_match = re.search(r'wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"', page_edit_res.text)
    if not page_edit_nonce_match:
        page_edit_nonce_match = re.search(r'"nonce":"([a-f0-9]{10})"', page_edit_res.text)
    
    rest_nonce = page_edit_nonce_match.group(1) if page_edit_nonce_match else ''
    print(f'[OK] REST Nonce from Page 68 edit screen: {rest_nonce}')

    page_api_url = f'{site_url}/wp-json/wp/v2/pages/68?context=edit'
    api_headers = {}
    if rest_nonce:
        api_headers['X-WP-Nonce'] = rest_nonce

    page_res = session.get(page_api_url, headers=api_headers, timeout=30)
    if page_res.status_code != 200:
        raise RuntimeError(f'Failed to fetch Page 68 from REST API: HTTP {page_res.status_code} - {page_res.text[:200]}')

    page_json = page_res.json()
    content = page_json.get('content', {}).get('raw', '')
    print(f'[OK] Fetched Page 68 successfully. Content length: {len(content)} characters.')

    # -------------------------------------------------------------------------
    # 2A. Update Announcement Strip in Page 68 (Agent 3 requirement)
    # -------------------------------------------------------------------------
    old_announcement_pattern = re.compile(
        r'<div class="re-announcement-strip">[\s\S]*?</div>', re.IGNORECASE
    )
    new_announcement_html = (
        '<div class="re-announcement-strip">\n'
        '    <span>WE COVER THE HEAVY DUTY COST ON EVERY MIRROR</span>\n'
        '  </div>'
    )
    if old_announcement_pattern.search(content):
        content = old_announcement_pattern.sub(new_announcement_html, content)
        print('[OK] Updated .re-announcement-strip in Page 68 with new wording.')

    # -------------------------------------------------------------------------
    # 2B. Ensure Why Choose Section has Pure Black Background (Agent 2 requirement)
    # -------------------------------------------------------------------------
    why_choose_id = 'id="re-why-choose-section"'
    if why_choose_id in content:
        old_bg = 'background-color: #383838 !important;'
        new_bg = 'background-color: #000000 !important;'
        if old_bg in content:
            content = content.replace(old_bg, new_bg)
            print('[OK] Updated #re-why-choose-section background color to #000000.')
        elif new_bg in content:
            print('[OK] #re-why-choose-section already has pure black background (#000000).')
    else:
        print('[WARN] Notice: #re-why-choose-section not found in Page 68.')

    # -------------------------------------------------------------------------
    # 2C. Replace Craftsmanship Video Slider with 3-Video Carousel (Agent 1 requirement)
    # -------------------------------------------------------------------------
    with open('templates/section_video_carousel.html', 'r', encoding='utf-8') as f:
        video_carousel_html = f.read().strip()

    v_idx = content.find('id="re-craftsmanship-video-slider"')
    if v_idx != -1:
        sec_start = content.rfind('<section', 0, v_idx)
        sec_end = content.find('</section>', v_idx) + len('</section>')
        content = content[:sec_start] + video_carousel_html + content[sec_end:]
        print('[OK] Replaced #re-craftsmanship-video-slider with Shopify Atelier 3-video auto-slideover component.')
    else:
        print('[WARN] Could not find #re-craftsmanship-video-slider in Page 68!')

    # -------------------------------------------------------------------------
    # 2D. Insert / Replace Crypto Moving Banner (Agent 2 requirement)
    # -------------------------------------------------------------------------
    with open('templates/section_crypto_banner.html', 'r', encoding='utf-8') as f:
        crypto_banner_html = f.read().strip()

    # Clean out redundant static crypto strip inside subscribe section if present
    static_crypto_pattern = re.compile(
        r'<!-- Crypto Strip -->[\s\S]*?<div class="re-crypto-strip">[\s\S]*?</div>', re.IGNORECASE
    )
    if static_crypto_pattern.search(content):
        content = static_crypto_pattern.sub('', content)
        print('[OK] Removed redundant static crypto strip from subscribe section.')

    c_idx = content.find('id="re-crypto-announcement-banner"')
    if c_idx != -1:
        c_start = content.rfind('<section', 0, c_idx)
        c_end = content.find('</section>', c_idx) + len('</section>')
        content = content[:c_start] + crypto_banner_html + content[c_end:]
        print('[OK] Updated existing #re-crypto-announcement-banner section.')
    else:
        faq_idx = content.find('id="re-faq-section"')
        if faq_idx != -1:
            faq_start = content.rfind('<section', 0, faq_idx)
            content = content[:faq_start] + crypto_banner_html + '\n\n' + content[faq_start:]
            print('[OK] Inserted #re-crypto-announcement-banner right before FAQ section.')
        else:
            content = content + '\n\n' + crypto_banner_html
            print('[OK] Appended #re-crypto-announcement-banner to Page 68.')

    # =========================================================================
    # STEP 3: ATOMICALLY SAVE PAGE 68
    # =========================================================================
    print('\n============================================================')
    print('STEP 3: Saving Unified Page 68 to WordPress REST API')
    print('============================================================')
    
    save_api_url = f'{site_url}/wp-json/wp/v2/pages/68'
    save_headers = {
        'Content-Type': 'application/json'
    }
    if rest_nonce:
        save_headers['X-WP-Nonce'] = rest_nonce

    save_payload = json.dumps({'content': content})
    save_res = session.post(save_api_url, data=save_payload, headers=save_headers, timeout=45)
    
    if save_res.status_code == 200:
        print('[OK] Page 68 saved successfully (HTTP 200 OK)!')
    else:
        raise RuntimeError(f'Failed to save Page 68 via REST API: HTTP {save_res.status_code} - {save_res.text[:300]}')

    # =========================================================================
    # STEP 4: PURGE CACHE (HOSTINGER & LITESPEED)
    # =========================================================================
    print('\n============================================================')
    print('STEP 4: Purging Hostinger Cache')
    print('============================================================')
    purge_url = f'{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache'
    purge_headers = {}
    if rest_nonce:
        purge_headers['X-WP-Nonce'] = rest_nonce
    purge_res = session.delete(purge_url, headers=purge_headers, timeout=20)
    print(f'Hostinger clear-cache status: {purge_res.status_code}')

    # LiteSpeed purge if link is available on dashboard
    dashboard_res = session.get(f'{site_url}/wp-admin/', timeout=20)
    litespeed_match = re.search(r'href="([^"]*litespeed-purge-all[^"]*)"', dashboard_res.text, re.IGNORECASE)
    if not litespeed_match:
        litespeed_match = re.search(r'href="([^"]*purge_all[^"]*)"', dashboard_res.text, re.IGNORECASE)
    
    if litespeed_match:
        raw_purge = litespeed_match.group(1).replace('&amp;', '&')
        ls_purge_url = raw_purge if raw_purge.startswith('http') else urljoin(f'{site_url}/wp-admin/', raw_purge)
        ls_res = session.get(ls_purge_url, timeout=20)
        print(f'LiteSpeed purge-all status: {ls_res.status_code}')

    # =========================================================================
    # STEP 5: VERIFY LIVE HOMEPAGE
    # =========================================================================
    print('\n============================================================')
    print('STEP 5: Public Live Site Verification')
    print('============================================================')
    live_res = session.get(f'{site_url}/?nocache={os.urandom(4).hex()}', timeout=30)
    print(f'Live Homepage HTTP Status: {live_res.status_code}')
    live_html = live_res.text

    check_ticker = 'WE COVER THE HEAVY DUTY COST ON EVERY MIRROR' in live_html
    check_why_choose = 'id="re-why-choose-section"' in live_html and 'background-color: #000000 !important;' in live_html
    check_crypto = 'id="re-crypto-announcement-banner"' in live_html and 'CRYPTO CURRENCY ACCEPTED' in live_html
    check_video = 'id="re-craftsmanship-video-slider"' in live_html and 're-carousel-track' in live_html

    print(f'1. [Agent 3] Ticker has "WE COVER THE HEAVY DUTY COST ON EVERY MIRROR": {check_ticker}')
    print(f'2. [Agent 2] Why Choose section has black (#000000) background: {check_why_choose}')
    print(f'3. [Agent 2] Crypto moving ticker active on page: {check_crypto}')
    print(f'4. [Agent 1] Craftsmanship 3-video visible auto-slideover active: {check_video}')

    if check_ticker and check_why_choose and check_crypto and check_video:
        print('\n[SUCCESS] ALL 3 AGENTS\' TASKS HAVE BEEN SAFELY UNIFIED AND DEPLOYED!')
    else:
        print('\n[STATUS] Deployment finished with the results above.')

if __name__ == '__main__':
    main()
