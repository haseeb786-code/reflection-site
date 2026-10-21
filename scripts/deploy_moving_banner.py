import urllib.request
import urllib.parse
import json
import base64
import re
import time
import ssl

ctx = ssl.create_default_context()

site_url = 'https://reflectionelite.com'
user = 'admin'
app_pass = 'oOei QLY7 j1mC Wb6U Gndx qYFg'
basic_auth = base64.b64encode(f"{user}:{app_pass}".encode()).decode()

print('1. Testing REST API authentication with App Password...')
req = urllib.request.Request(
    f"{site_url}/wp-json/wp/v2/pages/68?context=edit",
    headers={
        'Authorization': f'Basic {basic_auth}',
        'User-Agent': 'Mozilla/5.0'
    }
)

for attempt in range(1, 4):
    try:
        with urllib.request.urlopen(req, timeout=45, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"? Successfully fetched Page 68 on attempt {attempt}! Status: {resp.status}")
            break
    except Exception as e:
        print(f"Attempt {attempt} failed: {e}")
        time.sleep(2)
else:
    print("Could not fetch page 68 via REST API.")
    exit(1)

content = data.get('content', {}).get('raw', '')

# 1. Remove redundant static crypto strip if present
crypto_strip_regex = r'<!-- Crypto Strip -->[\s\S]*?<div class="re-crypto-strip">[\s\S]*?</div>'
content = re.sub(crypto_strip_regex, '', content, flags=re.IGNORECASE)

# 2. Moving announcement banner HTML matching Shopify Atelier
MOVING_BANNER_HTML = '''
<!-- ===================================================================== -->
<!-- SECTION: ANNOUNCEMENT BANNER 5 (PL) - CRYPTO CURRENCY ACCEPTED (MOVING TICKER) -->
<!-- ===================================================================== -->
<section id="re-crypto-announcement-banner" class="re-crypto-ticker-container">
  <style>
    #re-crypto-announcement-banner {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
      padding: 16px 0 !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      z-index: 5;
    }

    .re-crypto-ticker-track {
      display: flex;
      width: max-content;
      animation: reCryptoMarquee 10s linear infinite;
      will-change: transform;
    }

    .re-crypto-ticker-track:hover {
      animation-play-state: paused;
    }

    .re-crypto-ticker-content {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .re-crypto-ticker-item {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 0 45px;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .re-crypto-btc-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: #f7931a;
      color: #ffffff;
      border-radius: 50%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 700;
      box-shadow: 0 0 8px rgba(247, 147, 26, 0.5);
      flex-shrink: 0;
    }

    @keyframes reCryptoMarquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 767px) {
      #re-crypto-announcement-banner {
        padding: 12px 0 !important;
      }
      .re-crypto-ticker-item {
        font-size: 12px;
        gap: 10px;
        padding: 0 28px;
      }
      .re-crypto-btc-icon {
        width: 18px;
        height: 18px;
        font-size: 11px;
      }
    }
  </style>

  <div class="re-crypto-ticker-track">
    <div class="re-crypto-ticker-content">
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
    </div>
    <div class="re-crypto-ticker-content" aria-hidden="true">
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
    </div>
  </div>
</section>
'''.strip()

# 3. Insert or Replace Moving Banner
existing_banner_regex = r'<!-- =* -->[\s\S]*?<section id="re-crypto-announcement-banner"[\s\S]*?</section>'
if re.search(existing_banner_regex, content, flags=re.IGNORECASE):
    content = re.sub(existing_banner_regex, MOVING_BANNER_HTML, content, flags=re.IGNORECASE)
    print("Replaced existing banner.")
else:
    faq_target = '<section id="re-faq-section"'
    faq_idx = content.find(faq_target)
    if faq_idx == -1:
        print("re-faq-section not found!")
        exit(1)
    content = content[:faq_idx] + MOVING_BANNER_HTML + '\n\n' + content[faq_idx:]
    print("Inserted banner right before FAQ section.")

# 4. Save Page 68
print("2. Saving Page 68 via REST API...")
save_data = json.dumps({'content': content}).encode('utf-8')
save_req = urllib.request.Request(
    f"{site_url}/wp-json/wp/v2/pages/68",
    data=save_data,
    headers={
        'Authorization': f'Basic {basic_auth}',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
    },
    method='POST'
)

for attempt in range(1, 4):
    try:
        with urllib.request.urlopen(save_req, timeout=45, context=ctx) as resp:
            print(f"? Page 68 updated successfully on attempt {attempt}! Status: {resp.status}")
            break
    except Exception as e:
        print(f"Save attempt {attempt} failed: {e}")
        time.sleep(2)
else:
    print("Failed to save Page 68.")
    exit(1)

# 5. Purge Cache
print("3. Purging Hostinger cache...")
purge_req = urllib.request.Request(
    f"{site_url}/wp-json/hostinger-tools-plugin/v1/clear-cache",
    headers={
        'Authorization': f'Basic {basic_auth}',
        'User-Agent': 'Mozilla/5.0'
    },
    method='DELETE'
)
try:
    with urllib.request.urlopen(purge_req, timeout=30, context=ctx) as resp:
        print(f"? Hostinger cache cleared! Status: {resp.status}")
except Exception as e:
    # also try curl command for cache clear
    print(f"Hostinger tools purge note: {e}")

print("ALL COMPLETED!")
