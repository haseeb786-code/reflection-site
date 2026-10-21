<?php
/**
 * Plugin Name: Reflection Elite — Bitcoin (BTC) Payment Gateway
 * Plugin URI: https://reflectionelite.com
 * Description: Direct Bitcoin (BTC) payment gateway with scannable QR code and 1-click address copy for WooCommerce.
 * Version: 1.0.0
 * Author: Reflection Elite
 */

if (!defined('ABSPATH')) exit;

add_action('plugins_loaded', 're_init_bitcoin_gateway_class');

function re_init_bitcoin_gateway_class() {
    if (!class_exists('WC_Payment_Gateway')) return;

    class WC_Gateway_Bitcoin_RE extends WC_Payment_Gateway {

        public $btc_address;
        public $qr_code_url;
        public $instructions;

        public function __construct() {
            $this->id                 = 're_bitcoin';
            $this->icon               = '';
            $this->has_fields         = false;
            $this->method_title       = __('Bitcoin (BTC)', 'woocommerce');
            $this->method_description = __('Allows customers to pay directly to your Bitcoin wallet address with an instant QR code and 1-click copy address.', 'woocommerce');

            // Load settings
            $this->init_form_fields();
            $this->init_settings();

            $this->title        = $this->get_option('title', 'Pay with Bitcoin (BTC)');
            $this->description  = $this->get_option('description', 'Pay directly using Bitcoin (BTC) to our secure wallet. Instant QR code scan and copyable address provided.');
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
                    'default'     => __('Pay directly using Bitcoin (BTC) to our secure wallet. Instant QR code scan and copyable address provided.', 'woocommerce'),
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
    $gateways[] = 'WC_Gateway_Bitcoin_RE';
    return $gateways;
}
