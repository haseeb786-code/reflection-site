import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

const BITCOIN_GATEWAY_PHP = `
/* ==========================================================================
   REFLECTION ELITE — NATIVE BITCOIN (BTC) PAYMENT GATEWAY
   ========================================================================== */
add_action('after_setup_theme', 're_init_bitcoin_gateway_class');
add_action('init', 're_init_bitcoin_gateway_class');

function re_init_bitcoin_gateway_class() {
    if (!class_exists('WC_Payment_Gateway')) return;
    if (class_exists('WC_Gateway_Bitcoin_RE')) return;

    class WC_Gateway_Bitcoin_RE extends WC_Payment_Gateway {

        public $btc_address;
        public $qr_code_url;
        public $instructions;

        public function __construct() {
            $this->id                 = 're_bitcoin';
            $this->icon               = '';
            $this->has_fields         = false;
            $this->method_title       = __('Bitcoin (BTC)', 'woocommerce');
            $this->method_description = __('Direct Bitcoin payment to receiving wallet address with scannable QR code and 1-click address copy.', 'woocommerce');

            // Load settings
            $this->init_form_fields();
            $this->init_settings();

            $this->title        = $this->get_option('title', 'Pay with Bitcoin (BTC)');
            $this->description  = $this->get_option('description', 'Pay directly using Bitcoin (BTC) to our secure wallet. Instant scannable QR code and copyable address provided.');
            $this->btc_address  = $this->get_option('btc_address', 'bc1q2thh6pmgxlwzjhmh4k4e5tdsz8hwqdwqe40xwg');
            $this->qr_code_url  = $this->get_option('qr_code_url', 'https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/bitcoin-qr-reflection-elite.jpg');
            $this->instructions = $this->get_option('instructions', 'Please transfer the equivalent amount in Bitcoin (BTC) to our wallet address. Your order will be placed on hold until confirmed on the blockchain.');

            // Save admin options
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));

            // Thankyou page & Emails
            add_action('woocommerce_thankyou_' . $this->id, array($this, 'thankyou_page'));
            add_action('woocommerce_email_before_order_table', array($this, 'email_instructions'), 10, 3);
        }

        public function init_form_fields() {
            $this->form_fields = array(
                'enabled' => array(
                    'title'   => __('Enable/Disable', 'woocommerce'),
                    'type'    => 'checkbox',
                    'label'   => __('Enable Bitcoin Payment', 'woocommerce'),
                    'default' => 'yes',
                ),
                'title' => array(
                    'title'       => __('Title', 'woocommerce'),
                    'type'        => 'text',
                    'description' => __('Payment method title displayed during checkout.', 'woocommerce'),
                    'default'     => __('Pay with Bitcoin (BTC)', 'woocommerce'),
                    'desc_tip'    => true,
                ),
                'description' => array(
                    'title'       => __('Description', 'woocommerce'),
                    'type'        => 'textarea',
                    'description' => __('Payment method description displayed during checkout.', 'woocommerce'),
                    'default'     => __('Pay directly using Bitcoin (BTC) to our secure wallet. Instant scannable QR code and copyable address provided.', 'woocommerce'),
                ),
                'btc_address' => array(
                    'title'       => __('Bitcoin Receiving Address', 'woocommerce'),
                    'type'        => 'text',
                    'description' => __('Your Bitcoin receiving address.', 'woocommerce'),
                    'default'     => 'bc1q2thh6pmgxlwzjhmh4k4e5tdsz8hwqdwqe40xwg',
                ),
                'qr_code_url' => array(
                    'title'       => __('QR Code Image URL', 'woocommerce'),
                    'type'        => 'text',
                    'description' => __('URL to your Bitcoin QR Code image.', 'woocommerce'),
                    'default'     => 'https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/bitcoin-qr-reflection-elite.jpg',
                ),
                'instructions' => array(
                    'title'       => __('Instructions', 'woocommerce'),
                    'type'        => 'textarea',
                    'description' => __('Instructions shown on order confirmation page and emails.', 'woocommerce'),
                    'default'     => __('Please transfer the equivalent amount in Bitcoin (BTC) to our wallet address. Your order will be placed on hold until confirmed on the blockchain.', 'woocommerce'),
                ),
            );
        }

        public function payment_fields() {
            if ($this->description) {
                echo '<p style="color: #94a3b8; font-size: 13px; margin-bottom: 12px; line-height: 1.5;">' . wp_kses_post($this->description) . '</p>';
            }
            $this->render_bitcoin_box();
        }

        public function render_bitcoin_box($order = null) {
            $addr = esc_attr($this->btc_address);
            $qr = esc_url($this->qr_code_url);
            ?>
            <div class="re-btc-box" style="background: #121722; border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 12px; padding: 20px; margin: 15px 0; text-align: center; color: #f1f5f9; box-shadow: 0 8px 25px rgba(0,0,0,0.45);">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 14px;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #f7931a; color: #fff; border-radius: 50%; font-weight: 700; font-size: 16px;">₿</span>
                    <strong style="font-size: 15px; color: #d4af37; letter-spacing: 1px; text-transform: uppercase;">Direct Bitcoin Payment</strong>
                </div>

                <?php if ($qr): ?>
                <div style="margin: 10px auto 14px auto; display: inline-block; padding: 10px; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <img src="<?php echo $qr; ?>" alt="Bitcoin Receiving QR Code" style="width: 175px; height: 175px; display: block; object-fit: contain; margin: 0 auto;" />
                </div>
                <?php endif; ?>

                <div style="margin: 12px 0;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 6px;">Receiving BTC Address (Native SegWit)</div>
                    <div style="background: #090c12; border: 1px dashed rgba(212, 175, 55, 0.5); border-radius: 8px; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #f3e5ab; word-break: break-all; user-select: all; line-height: 1.4;" id="re-btc-address-val"><?php echo $addr; ?></div>
                </div>

                <div style="margin-top: 10px;">
                    <button type="button" id="re-copy-btc-btn" onclick="(function(btn){
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText('<?php echo $addr; ?>').then(function(){
                                btn.innerText = '✓ Address Copied!';
                                btn.style.background = '#22c55e';
                                btn.style.color = '#ffffff';
                                setTimeout(function(){
                                    btn.innerText = 'Copy BTC Address';
                                    btn.style.background = 'linear-gradient(135deg, #d4af37, #aa820a)';
                                    btn.style.color = '#090c12';
                                }, 3000);
                            });
                        }
                    })(this);" style="background: linear-gradient(135deg, #d4af37, #aa820a); border: none; color: #090c12; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 6px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.25s ease; box-shadow: 0 4px 12px rgba(212,175,55,0.3);">
                        Copy BTC Address
                    </button>
                </div>

                <div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                        <strong style="color: #f3e5ab;">Instructions:</strong> Open your Bitcoin wallet app, scan the QR code above or paste the address. Transfer the equivalent order total, then click <em>Place Order</em>. Your order status will update to <em>On Hold</em> while we verify the blockchain confirmation.
                    </p>
                </div>
            </div>
            <?php
        }

        public function process_payment($order_id) {
            $order = wc_get_order($order_id);

            // Update order status to on-hold
            $order->update_status('on-hold', sprintf(__('Awaiting Bitcoin payment to address: %s', 'woocommerce'), $this->btc_address));

            // Reduce stock
            wc_reduce_stock_levels($order_id);

            // Empty cart
            WC()->cart->empty_cart();

            return array(
                'result'   => 'success',
                'redirect' => $this->get_return_url($order),
            );
        }

        public function thankyou_page($order_id) {
            $order = wc_get_order($order_id);
            if ($this->instructions) {
                echo '<div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 8px; padding: 14px; margin-bottom: 20px; color: #f3e5ab; font-size: 14px;">';
                echo '<strong>Payment Notice:</strong> ' . wpautop(wptexturize($this->instructions));
                echo '</div>';
            }
            $this->render_bitcoin_box($order);
        }

        public function email_instructions($order, $sent_to_admin, $plain_text = false) {
            if ($sent_to_admin || 'on-hold' !== $order->get_status() || $this->id !== $order->get_payment_method()) {
                return;
            }
            if ($this->instructions) {
                echo wpautop(wptexturize($this->instructions)) . PHP_EOL;
            }
            echo '<p><strong>Bitcoin Receiving Address:</strong> ' . esc_html($this->btc_address) . '</p>';
        }
    }
}

add_filter('woocommerce_payment_gateways', 're_add_bitcoin_gateway_class');
function re_add_bitcoin_gateway_class($gateways) {
    if (class_exists('WC_Payment_Gateway')) {
        re_init_bitcoin_gateway_class();
    }
    $gateways[] = 'WC_Gateway_Bitcoin_RE';
    return $gateways;
}
`;

async function applyBitcoinGateway() {
  console.log('=== 1. LOGGING IN TO WORDPRESS ADMIN ===');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });
  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');
  console.log('Login successful!');

  console.log('=== 2. READING CURRENT FUNCTIONS.PHP ===');
  const editorRes = await fetch(`${WP_URL}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: allCookies }
  });
  const html = await editorRes.text();
  
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!contentMatch) {
    throw new Error('Could not find textarea id="newcontent"');
  }
  
  let currentCode = contentMatch[1]
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  const nonceMatch = html.match(/name="nonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find nonce for theme editor');
  }
  const nonce = nonceMatch[1];
  console.log('Found theme-editor nonce:', nonce);

  // Clean out any existing Bitcoin code block to avoid duplication
  currentCode = currentCode.replace(/\/\* ==========================================================================\s+REFLECTION ELITE — NATIVE BITCOIN \(BTC\) PAYMENT GATEWAY[\s\S]*$/g, '').trim();

  // Append new Bitcoin Gateway code
  const newCode = currentCode + '\n\n' + BITCOIN_GATEWAY_PHP.trim() + '\n';
  console.log(`Updated code length: ${newCode.length} characters.`);

  console.log('=== 3. SAVING FUNCTIONS.PHP VIA THEME EDITOR ===');
  const updateParams = new URLSearchParams();
  updateParams.append('nonce', nonce);
  updateParams.append('_wp_http_referer', '/wp-admin/theme-editor.php?file=functions.php&theme=astra');
  updateParams.append('action', 'update');
  updateParams.append('file', 'functions.php');
  updateParams.append('theme', 'astra');
  updateParams.append('newcontent', newCode);
  updateParams.append('submit', 'Update File');

  const saveRes = await fetch(`${WP_URL}/wp-admin/theme-editor.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: allCookies
    },
    body: updateParams.toString()
  });

  console.log('Save response status:', saveRes.status);
  const saveHtml = await saveRes.text();
  if (saveHtml.includes('File edited successfully') || saveHtml.includes('notice-success')) {
    console.log('[SUCCESS] functions.php updated successfully in Astra theme!');
  } else {
    console.log('Save result check (contains error?):', saveHtml.includes('notice-error'));
  }

  console.log('\n=== 4. VERIFYING PAYMENT GATEWAYS VIA WOOCOMMERCE REST API ===');
  const gwRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways`, { headers: authHeader });
  const gateways = await gwRes.json();
  let btc = null;
  console.log('Gateways in WooCommerce:');
  for (const g of gateways) {
    console.log(` - [${g.enabled ? 'ENABLED' : 'DISABLED'}] ID: ${g.id} | Title: ${g.title}`);
    if (g.id === 're_bitcoin') {
      btc = g;
    }
  }

  if (btc) {
    console.log('\n[SUCCESS] re_bitcoin is registered in WooCommerce!');
    if (!btc.enabled) {
      console.log('Enabling re_bitcoin gateway via REST API...');
      const enRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/re_bitcoin`, {
        method: 'PUT',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: true })
      });
      const enData = await enRes.json();
      console.log('re_bitcoin enabled state:', enData.enabled);
    }
  } else {
    console.error('\n[ERROR] re_bitcoin gateway not found in WooCommerce list.');
  }
}

applyBitcoinGateway().catch(console.error);
