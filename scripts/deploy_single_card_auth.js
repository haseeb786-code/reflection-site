import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function deploySingleCardAuth() {
  console.log('=== PREPARING LUXURY SINGLE-CARD AUTH DEPLOYMENT ===');
  
  // Read current header and footer
  let headerCode = fs.readFileSync('scripts/wpcode_header_current.html', 'utf8');
  let footerCode = fs.readFileSync('scripts/wpcode_footer_current.html', 'utf8');
  
  // Define new CSS for the single-card auth and account dashboard
  const NEW_AUTH_CSS = `
/* ==========================================================================
   LUXURY SINGLE-CARD AUTHENTICATION SYSTEM (LOGIN / SIGNUP TOGGLE)
   Matches user reference: Single centered card, segmented pill switch, no split screen
   ========================================================================== */
.woocommerce-account .te-wc-container {
  max-width: 960px !important;
  margin: 40px auto 60px auto !important;
  padding: 0 20px !important;
  box-sizing: border-box !important;
}

/* Base card container - eliminate default WooCommerce col2-set split layout */
#customer_login.u-columns.col2-set {
  display: block !important;
  width: 100% !important;
  max-width: 440px !important;
  margin: 20px auto 40px auto !important;
  background: #111215 !important;
  border: 1px solid rgba(197, 168, 128, 0.28) !important;
  border-radius: 20px !important;
  padding: 36px 32px !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.04) !important;
  box-sizing: border-box !important;
  position: relative !important;
  overflow: hidden !important;
}

@media (max-width: 480px) {
  #customer_login.u-columns.col2-set {
    max-width: 100% !important;
    padding: 28px 20px !important;
    border-radius: 16px !important;
    margin: 15px auto 30px auto !important;
  }
}

/* Hide default WooCommerce headings inside columns */
#customer_login .u-column1 h2,
#customer_login .u-column2 h2 {
  display: none !important;
}

/* Both form columns take 100% width of the single card */
#customer_login .u-column1,
#customer_login .u-column2 {
  float: none !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  box-sizing: border-box !important;
}

/* State management: ONLY ONE FORM VISIBLE AT A TIME */
#customer_login .u-column1 {
  display: block !important;
  animation: reAuthFadeIn 0.3s ease-in-out;
}
#customer_login .u-column2 {
  display: none !important;
}

/* When in Signup mode */
#customer_login.re-mode-signup .u-column1 {
  display: none !important;
}
#customer_login.re-mode-signup .u-column2 {
  display: block !important;
  animation: reAuthFadeIn 0.3s ease-in-out;
}

@keyframes reAuthFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Card Header */
.re-auth-card-header {
  text-align: center;
  margin-bottom: 26px;
}
.re-auth-card-title {
  font-family: var(--font-trajan), serif !important;
  color: #ffffff !important;
  font-size: 1.6rem !important;
  letter-spacing: 0.06em !important;
  margin: 0 0 20px 0 !important;
  font-weight: 700 !important;
}

/* Segmented Pill Switcher [ Login ] [ Signup ] */
.re-auth-switcher {
  display: flex !important;
  background: #18191e !important;
  border: 1px solid rgba(197, 168, 128, 0.22) !important;
  border-radius: 40px !important;
  padding: 4px !important;
  margin: 0 auto !important;
  width: 100% !important;
  box-sizing: border-box !important;
  gap: 4px !important;
}
.re-auth-tab {
  flex: 1 !important;
  background: transparent !important;
  border: none !important;
  color: #a1a1aa !important;
  font-family: var(--font-body), sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  padding: 11px 20px !important;
  border-radius: 32px !important;
  cursor: pointer !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  outline: none !important;
  text-align: center !important;
  user-select: none !important;
}
.re-auth-tab:hover {
  color: #ffffff !important;
}
.re-auth-tab.active {
  background: linear-gradient(135deg, #c5a572, #dfc299) !important;
  color: #0c0d10 !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 14px rgba(197, 168, 128, 0.35) !important;
}

/* Inner Form Elements */
#customer_login form.woocommerce-form {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  max-width: 100% !important;
  width: 100% !important;
}

#customer_login .form-row {
  margin: 0 0 18px 0 !important;
  padding: 0 !important;
  width: 100% !important;
  display: block !important;
  float: none !important;
}

#customer_login label {
  display: block !important;
  font-family: var(--font-body), sans-serif !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #d4d4d8 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  margin-bottom: 7px !important;
}
#customer_login label .required {
  color: #c5a572 !important;
  text-decoration: none !important;
}

#customer_login input.input-text {
  width: 100% !important;
  box-sizing: border-box !important;
  background: #18191e !important;
  border: 1px solid rgba(197, 168, 128, 0.28) !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  padding: 13px 16px !important;
  font-size: 14px !important;
  outline: none !important;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
  font-family: var(--font-body), sans-serif !important;
}
#customer_login input.input-text:focus {
  border-color: #c5a572 !important;
  box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.2) !important;
  background: #1c1e24 !important;
}
#customer_login input.input-text::placeholder {
  color: #71717a !important;
  font-size: 13px !important;
}

/* Remember me & Lost password row */
.woocommerce-form-login__rememberme {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 13px !important;
  color: #a1a1aa !important;
  cursor: pointer !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  margin: 0 !important;
  user-select: none !important;
}
.woocommerce-form-login__rememberme input {
  accent-color: #c5a572 !important;
  width: 16px !important;
  height: 16px !important;
  cursor: pointer !important;
}

.woocommerce-LostPassword.lost_password {
  margin: 10px 0 0 0 !important;
  text-align: right !important;
}
.woocommerce-LostPassword a {
  color: #a1a1aa !important;
  font-size: 13px !important;
  text-decoration: none !important;
  transition: color 0.2s !important;
}
.woocommerce-LostPassword a:hover {
  color: #c5a572 !important;
  text-decoration: underline !important;
}

/* Full-width primary pill action buttons */
#customer_login button.button,
#customer_login button.woocommerce-form-login__submit,
#customer_login button.woocommerce-form-register__submit {
  display: block !important;
  width: 100% !important;
  background: linear-gradient(135deg, #c5a572, #dfc299) !important;
  color: #0c0d10 !important;
  font-family: var(--font-trajan), serif !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  padding: 14px 24px !important;
  border-radius: 30px !important;
  border: none !important;
  margin: 22px 0 0 0 !important;
  cursor: pointer !important;
  box-shadow: 0 6px 20px rgba(197, 168, 128, 0.28) !important;
  transition: all 0.25s ease !important;
  text-align: center !important;
}
#customer_login button.button:hover,
#customer_login button.woocommerce-form-login__submit:hover,
#customer_login button.woocommerce-form-register__submit:hover {
  background: linear-gradient(135deg, #dfc299, #f0d8b0) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 8px 24px rgba(197, 168, 128, 0.4) !important;
}

/* Bottom switch prompt (Matches reference: "Create an account Signup now") */
.re-auth-switch-footer {
  margin-top: 24px !important;
  text-align: center !important;
  font-size: 13px !important;
  color: #9ca3af !important;
  font-family: var(--font-body), sans-serif !important;
}
.re-auth-switch-footer a {
  color: #c5a572 !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  margin-left: 5px !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}
.re-auth-switch-footer a:hover {
  color: #dfc299 !important;
  text-decoration: underline !important;
}

/* Privacy policy text in registration */
.woocommerce-privacy-policy-text {
  font-size: 11px !important;
  color: #71717a !important;
  line-height: 1.5 !important;
  margin: 12px 0 !important;
}
.woocommerce-privacy-policy-text a {
  color: #c5a572 !important;
  text-decoration: underline !important;
}

/* Notice banners (Errors / Success) */
.woocommerce-notices-wrapper {
  max-width: 440px;
  margin: 0 auto 16px auto;
}
.woocommerce-error, .woocommerce-info, .woocommerce-message {
  background: #191416 !important;
  border: 1px solid #e11d48 !important;
  color: #fca5a5 !important;
  border-radius: 10px !important;
  padding: 14px 18px !important;
  font-size: 13px !important;
  list-style: none !important;
}
.woocommerce-message {
  border-color: #c5a572 !important;
  color: #e5c798 !important;
  background: #171614 !important;
}
.woocommerce-error a, .woocommerce-info a, .woocommerce-message a {
  color: #ffffff !important;
  text-decoration: underline !important;
}

/* ==========================================================================
   LOGGED-IN DASHBOARD LUXURY STYLING (IMAGE 1 FIX)
   ========================================================================== */
.woocommerce-account .woocommerce, .woocommerce-MyAccount-content, .woocommerce-MyAccount-navigation {
  background: transparent !important;
  color: var(--color-text-light) !important;
}
.woocommerce-account .woocommerce {
  max-width: 1040px !important;
  margin: 0 auto !important;
}
.woocommerce-account .woocommerce:after {
  content: "" !important;
  display: table !important;
  clear: both !important;
}

.woocommerce-account .woocommerce-MyAccount-navigation {
  float: left !important;
  width: 250px !important;
  margin: 0 0 30px 0 !important;
}

.woocommerce-account .woocommerce-MyAccount-navigation ul {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  list-style: none !important;
  padding: 8px !important;
  margin: 0 !important;
  background: #111215 !important;
  border: 1px solid rgba(197, 168, 128, 0.22) !important;
  border-radius: 12px !important;
}

.woocommerce-account .woocommerce-MyAccount-navigation ul li,
.woocommerce-MyAccount-navigation ul li,
.woocommerce-MyAccount-navigation li {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  border: none !important;
  border-bottom: none !important;
  background: transparent !important;
}

.woocommerce-account .woocommerce-MyAccount-navigation ul li a,
.woocommerce-MyAccount-navigation li a {
  display: block !important;
  padding: 12px 18px !important;
  color: #a1a1aa !important;
  font-family: var(--font-trajan), serif !important;
  font-size: 12px !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
  border-radius: 8px !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  transition: all 0.2s ease !important;
}

.woocommerce-account .woocommerce-MyAccount-navigation ul li a:hover,
.woocommerce-MyAccount-navigation li a:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

.woocommerce-account .woocommerce-MyAccount-navigation ul li.is-active a,
.woocommerce-MyAccount-navigation li.is-active a {
  background: rgba(197, 168, 128, 0.15) !important;
  color: #c5a572 !important;
  border: 1px solid rgba(197, 168, 128, 0.45) !important;
  font-weight: 600 !important;
}

.woocommerce-account .woocommerce-MyAccount-content {
  float: right !important;
  width: calc(100% - 280px) !important;
  background: #111215 !important;
  border: 1px solid rgba(197, 168, 128, 0.22) !important;
  border-radius: 12px !important;
  padding: 32px 30px !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
  color: #e4e4e7 !important;
  font-family: var(--font-body), sans-serif !important;
  line-height: 1.7 !important;
  box-sizing: border-box !important;
}
.woocommerce-account .woocommerce-MyAccount-content a {
  color: #c5a572 !important;
  text-decoration: underline !important;
}
.woocommerce-account .woocommerce-MyAccount-content a:hover {
  color: #dfc299 !important;
}

@media (max-width: 820px) {
  .woocommerce-account .woocommerce-MyAccount-navigation {
    float: none !important;
    width: 100% !important;
    margin-bottom: 20px !important;
  }
  .woocommerce-account .woocommerce-MyAccount-navigation ul {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
  }
  .woocommerce-account .woocommerce-MyAccount-navigation ul li {
    flex: 1 1 calc(50% - 6px) !important;
  }
  .woocommerce-account .woocommerce-MyAccount-navigation ul li a {
    text-align: center !important;
    padding: 10px 8px !important;
    font-size: 11px !important;
  }
  .woocommerce-account .woocommerce-MyAccount-content {
    float: none !important;
    width: 100% !important;
    padding: 24px 18px !important;
  }
}
`;

  // Replace old woocommerce-account section in header
  const oldAccountStartIdx = headerCode.indexOf('/* ==========================================================================\n   WOOCOMMERCE ACCOUNT & SEARCH RESULT STYLES');
  const searchResultsStartIdx = headerCode.indexOf('/* Search results product styling */');
  
  if (oldAccountStartIdx !== -1 && searchResultsStartIdx !== -1) {
    console.log('✓ Found old account CSS block. Replacing with single-card auth CSS...');
    headerCode = headerCode.substring(0, oldAccountStartIdx) + NEW_AUTH_CSS + '\n' + headerCode.substring(searchResultsStartIdx);
  } else {
    console.log('Old account CSS block boundary not found. Appending before closing style tag.');
    const closeStyleIdx = headerCode.lastIndexOf('</style>');
    headerCode = headerCode.substring(0, closeStyleIdx) + NEW_AUTH_CSS + '\n</style>' + headerCode.substring(closeStyleIdx + 8);
  }

  // Define new JavaScript switcher for footer
  const NEW_AUTH_JS = `
<script id="re-auth-card-switcher-engine">
(function initAuthCardSwitcher() {
  function setupAuthSwitcher() {
    const card = document.getElementById('customer_login');
    if (!card) return;
    if (card.querySelector('.re-auth-switcher')) return; // Already setup

    // 1. Create Card Header with segmented tabs
    const header = document.createElement('div');
    header.className = 're-auth-card-header';
    header.innerHTML = \`
      <h2 class="re-auth-card-title" id="reAuthCardTitle">Login Form</h2>
      <div class="re-auth-switcher" role="tablist">
        <button type="button" class="re-auth-tab active" data-tab="login" role="tab" aria-selected="true">Login</button>
        <button type="button" class="re-auth-tab" data-tab="register" role="tab" aria-selected="false">Signup</button>
      </div>
    \`;
    card.insertBefore(header, card.firstChild);

    const titleEl = header.querySelector('#reAuthCardTitle');
    const tabLogin = header.querySelector('.re-auth-tab[data-tab="login"]');
    const tabRegister = header.querySelector('.re-auth-tab[data-tab="register"]');

    // 2. Add placeholders and footer switch link to Login form
    const loginCol = card.querySelector('.u-column1');
    if (loginCol) {
      const uField = loginCol.querySelector('#username');
      if (uField) uField.setAttribute('placeholder', 'Enter username or email address');
      const pField = loginCol.querySelector('#password');
      if (pField) pField.setAttribute('placeholder', 'Enter your password');

      const loginForm = loginCol.querySelector('form');
      if (loginForm && !loginForm.querySelector('.re-auth-switch-footer')) {
        const loginFoot = document.createElement('div');
        loginFoot.className = 're-auth-switch-footer';
        loginFoot.innerHTML = 'Create an account <a class="re-to-signup" href="#register">Signup now</a>';
        loginForm.appendChild(loginFoot);
        loginFoot.querySelector('.re-to-signup').addEventListener('click', (e) => {
          e.preventDefault();
          setTab('register');
        });
      }
    }

    // 3. Add placeholders and footer switch link to Register form
    const regCol = card.querySelector('.u-column2');
    if (regCol) {
      const regEmail = regCol.querySelector('#reg_email');
      if (regEmail) regEmail.setAttribute('placeholder', 'Enter your email address');
      const regPass = regCol.querySelector('#reg_password');
      if (regPass) regPass.setAttribute('placeholder', 'Create a password');

      const regForm = regCol.querySelector('form');
      if (regForm && !regForm.querySelector('.re-auth-switch-footer')) {
        const regFoot = document.createElement('div');
        regFoot.className = 're-auth-switch-footer';
        regFoot.innerHTML = 'Already have an account? <a class="re-to-login" href="#login">Login now</a>';
        regForm.appendChild(regFoot);
        regFoot.querySelector('.re-to-login').addEventListener('click', (e) => {
          e.preventDefault();
          setTab('login');
        });
      }
    }

    function setTab(tab) {
      if (tab === 'register') {
        card.classList.add('re-mode-signup');
        tabRegister.classList.add('active');
        tabRegister.setAttribute('aria-selected', 'true');
        tabLogin.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'false');
        if (titleEl) titleEl.textContent = 'Signup Form';
        if (history.replaceState) {
          history.replaceState(null, '', '#register');
        }
      } else {
        card.classList.remove('re-mode-signup');
        tabLogin.classList.add('active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabRegister.classList.remove('active');
        tabRegister.setAttribute('aria-selected', 'false');
        if (titleEl) titleEl.textContent = 'Login Form';
        if (history.replaceState) {
          history.replaceState(null, '', '#login');
        }
      }
    }

    tabLogin.addEventListener('click', (e) => {
      e.preventDefault();
      setTab('login');
    });

    tabRegister.addEventListener('click', (e) => {
      e.preventDefault();
      setTab('register');
    });

    // Check if initial hash is #register or URL has action=register
    const hasRegHash = window.location.hash === '#register' || window.location.search.includes('register');
    
    // Check if there was a registration error returned by WooCommerce
    const notices = document.querySelector('.woocommerce-error, .woocommerce-notices-wrapper');
    const noticeText = notices ? notices.textContent.toLowerCase() : '';
    const hasRegError = noticeText.includes('registration') || 
                        noticeText.includes('an account is already registered') || 
                        noticeText.includes('valid email');

    if (hasRegHash || hasRegError) {
      setTab('register');
    } else {
      setTab('login');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAuthSwitcher);
  } else {
    setupAuthSwitcher();
  }
})();
</script>
`;

  // Remove any previous version of re-auth-card-switcher-engine from footer
  if (footerCode.includes('re-auth-card-switcher-engine')) {
    footerCode = footerCode.replace(/<script id="re-auth-card-switcher-engine">[\s\S]*?<\/script>/, '');
  }
  footerCode = footerCode.trim() + '\n\n' + NEW_AUTH_JS.trim() + '\n';

  // Save local copies
  fs.writeFileSync('scripts/wpcode_header_current.html', headerCode, 'utf8');
  fs.writeFileSync('scripts/wpcode_footer_current.html', footerCode, 'utf8');
  console.log('✓ Local files updated.');

  // Push to WPCode on production
  console.log('Pushing to WPCode...');
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find nonce on WPCode page');
  }
  const nonce = nonceMatch[1];
  console.log('✓ Found WPCode Nonce:', nonce);

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', headerCode);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', footerCode);

  const saveRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });
  console.log(`✓ WPCode saved with HTTP status ${saveRes.status}`);

  // Purge Hostinger CDN cache
  console.log('Purging Hostinger CDN cache...');
  const cacheRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': (await (await fetch(`${siteUrl}/wp-json/wp/v2/users/me`, { headers: { Cookie: cookies } })).headers.get('x-wp-nonce')) || ''
    }
  });
  console.log('✓ Cache purge response:', cacheRes.status);
}

deploySingleCardAuth().catch(console.error);
