<?php
/**
 * Astra functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Astra
 * @since 1.0.0
 */

if ( ! defined( &#039;ABSPATH&#039; ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Define Constants
 */
define( &#039;ASTRA_THEME_VERSION&#039;, &#039;4.14.1&#039; );
define( &#039;ASTRA_THEME_SETTINGS&#039;, &#039;astra-settings&#039; );
define( &#039;ASTRA_THEME_DIR&#039;, trailingslashit( get_template_directory() ) );
define( &#039;ASTRA_THEME_URI&#039;, trailingslashit( esc_url( get_template_directory_uri() ) ) );
define( &#039;ASTRA_THEME_ORG_VERSION&#039;, file_exists( ASTRA_THEME_DIR . &#039;inc/w-org-version.php&#039; ) );

/**
 * Minimum Version requirement of the Astra Pro addon.
 * This constant will be used to display the notice asking user to update the Astra addon to the version defined below.
 */
define( &#039;ASTRA_EXT_MIN_VER&#039;, &#039;4.12.0&#039; );

/**
 * Load in-house compatibility.
 */
if ( ASTRA_THEME_ORG_VERSION ) {
	require_once ASTRA_THEME_DIR . &#039;inc/w-org-version.php&#039;;
}

/**
 * Setup helper functions of Astra.
 */
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-theme-options.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/class-theme-strings.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/common-functions.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-icons.php&#039;;

define( &#039;ASTRA_WEBSITE_BASE_URL&#039;, &#039;https://wpastra.com&#039; );

/**
 * Update theme
 */
require_once ASTRA_THEME_DIR . &#039;inc/theme-update/astra-update-functions.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/theme-update/class-astra-theme-background-updater.php&#039;;

/**
 * Fonts Files
 */
require_once ASTRA_THEME_DIR . &#039;inc/customizer/class-astra-font-families.php&#039;;
if ( is_admin() ) {
	require_once ASTRA_THEME_DIR . &#039;inc/customizer/class-astra-fonts-data.php&#039;;
}

require_once ASTRA_THEME_DIR . &#039;inc/lib/webfont/class-astra-webfont-loader.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/lib/docs/class-astra-docs-loader.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/customizer/class-astra-fonts.php&#039;;

require_once ASTRA_THEME_DIR . &#039;inc/dynamic-css/custom-menu-old-header.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/dynamic-css/container-layouts.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/dynamic-css/astra-icons.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-walker-page.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-enqueue-scripts.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/class-gutenberg-editor-css.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-wp-editor-css.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-command-palette.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/dynamic-css/block-editor-compatibility.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/dynamic-css/inline-on-mobile.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/dynamic-css/content-background.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/dynamic-css/dark-mode.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/class-astra-dynamic-css.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/class-astra-global-palette.php&#039;;

// Enable NPS Survey only if the starter templates version is < 4.3.7 or > 4.4.4 to prevent fatal error.
if ( ! defined( &#039;ASTRA_SITES_VER&#039; ) || version_compare( ASTRA_SITES_VER, &#039;4.3.7&#039;, &#039;<&#039; ) || version_compare( ASTRA_SITES_VER, &#039;4.4.4&#039;, &#039;>&#039; ) ) {
	// NPS Survey Integration
	require_once ASTRA_THEME_DIR . &#039;inc/lib/class-astra-nps-notice.php&#039;;
	require_once ASTRA_THEME_DIR . &#039;inc/lib/class-astra-nps-survey.php&#039;;
}

/**
 * Custom template tags for this theme.
 */
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-attr.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/template-tags.php&#039;;

require_once ASTRA_THEME_DIR . &#039;inc/widgets.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/theme-hooks.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/admin-functions.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/class-astra-memory-limit-notice.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/sidebar-manager.php&#039;;

/**
 * Markup Functions
 */
require_once ASTRA_THEME_DIR . &#039;inc/markup-extras.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/extras.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/blog/blog-config.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/blog/blog.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/blog/single-blog.php&#039;;

/**
 * Markup Files
 */
require_once ASTRA_THEME_DIR . &#039;inc/template-parts.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/class-astra-loop.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/class-astra-mobile-header.php&#039;;

/**
 * Functions and definitions.
 */
require_once ASTRA_THEME_DIR . &#039;inc/class-astra-after-setup-theme.php&#039;;

// Required files.
require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-admin-helper.php&#039;;

require_once ASTRA_THEME_DIR . &#039;inc/schema/class-astra-schema.php&#039;;

/* Setup API */
require_once ASTRA_THEME_DIR . &#039;admin/includes/class-astra-learn.php&#039;;
require_once ASTRA_THEME_DIR . &#039;admin/includes/class-astra-api-init.php&#039;;

if ( is_admin() ) {
	/**
	 * Admin Menu Settings
	 */
	require_once ASTRA_THEME_DIR . &#039;inc/core/class-astra-admin-settings.php&#039;;
	require_once ASTRA_THEME_DIR . &#039;admin/class-astra-admin-loader.php&#039;;
	require_once ASTRA_THEME_DIR . &#039;inc/lib/astra-notices/class-bsf-admin-notices.php&#039;;
}

/**
 * BSF Analytics.
 */
require_once ASTRA_THEME_DIR . &#039;admin/class-astra-bsf-analytics.php&#039;;

/**
 * Metabox additions.
 */
require_once ASTRA_THEME_DIR . &#039;inc/metabox/class-astra-meta-boxes.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/metabox/class-astra-meta-box-operations.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/metabox/class-astra-elementor-editor-settings.php&#039;;

/**
 * Customizer additions.
 */
require_once ASTRA_THEME_DIR . &#039;inc/customizer/class-astra-customizer.php&#039;;

/**
 * Astra Modules.
 */
require_once ASTRA_THEME_DIR . &#039;inc/modules/posts-structures/class-astra-post-structures.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/modules/related-posts/class-astra-related-posts.php&#039;;

/**
 * Compatibility
 */
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-gutenberg.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-jetpack.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/woocommerce/class-astra-woocommerce.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/edd/class-astra-edd.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/lifterlms/class-astra-lifterlms.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/learndash/class-astra-learndash.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-beaver-builder.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-bb-ultimate-addon.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-contact-form-7.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-visual-composer.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-site-origin.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-gravity-forms.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-bne-flyout.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-ubermeu.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-divi-builder.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-amp.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-yoast-seo.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/surecart/class-astra-surecart.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-starter-content.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-buddypress.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/addons/transparent-header/class-astra-ext-transparent-header.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/addons/breadcrumbs/class-astra-breadcrumbs.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/addons/scroll-to-top/class-astra-scroll-to-top.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/addons/heading-colors/class-astra-heading-colors.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/builder/class-astra-builder-loader.php&#039;;

// Elementor Compatibility requires PHP 5.4 for namespaces.
if ( version_compare( PHP_VERSION, &#039;5.4&#039;, &#039;>=&#039; ) ) {
	require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-elementor.php&#039;;
	require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-elementor-pro.php&#039;;
	require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-web-stories.php&#039;;
}

// Beaver Themer compatibility requires PHP 5.3 for anonymous functions.
if ( version_compare( PHP_VERSION, &#039;5.3&#039;, &#039;>=&#039; ) ) {
	require_once ASTRA_THEME_DIR . &#039;inc/compatibility/class-astra-beaver-themer.php&#039;;
}

require_once ASTRA_THEME_DIR . &#039;inc/core/markup/class-astra-markup.php&#039;;

/**
 * Abilities API integration.
 */
require_once ASTRA_THEME_DIR . &#039;inc/abilities/bootstrap.php&#039;;

/**
 * Load deprecated functions
 */
require_once ASTRA_THEME_DIR . &#039;inc/core/deprecated/deprecated-filters.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/deprecated/deprecated-hooks.php&#039;;
require_once ASTRA_THEME_DIR . &#039;inc/core/deprecated/deprecated-functions.php&#039;;

/* ==========================================================================
   REFLECTION ELITE — NATIVE BITCOIN (BTC) PAYMENT GATEWAY
   ========================================================================== */
add_action(&#039;after_setup_theme&#039;, &#039;re_init_bitcoin_gateway_class&#039;);
add_action(&#039;init&#039;, &#039;re_init_bitcoin_gateway_class&#039;);

function re_init_bitcoin_gateway_class() {
    if (!class_exists(&#039;WC_Payment_Gateway&#039;)) return;
    if (class_exists(&#039;WC_Gateway_Bitcoin_RE&#039;)) return;

    class WC_Gateway_Bitcoin_RE extends WC_Payment_Gateway {

        public $btc_address;
        public $qr_code_url;
        public $instructions;

        public function __construct() {
            $this->id                 = &#039;re_bitcoin&#039;;
            $this->icon               = &#039;&#039;;
            $this->has_fields         = false;
            $this->method_title       = __(&#039;Bitcoin (BTC)&#039;, &#039;woocommerce&#039;);
            $this->method_description = __(&#039;Direct Bitcoin payment to receiving wallet address with scannable QR code and 1-click address copy.&#039;, &#039;woocommerce&#039;);

            // Load settings
            $this->init_form_fields();
            $this->init_settings();

            $this->title        = $this->get_option(&#039;title&#039;, &#039;Pay with Bitcoin (BTC)&#039;);
            $this->description  = $this->get_option(&#039;description&#039;, &#039;Pay directly using Bitcoin (BTC) to our secure wallet. Instant scannable QR code and copyable address provided.&#039;);
            $this->btc_address  = $this->get_option(&#039;btc_address&#039;, &#039;bc1q2thh6pmgxlwzjhmh4k4e5tdsz8hwqdwqe40xwg&#039;);
            $this->qr_code_url  = $this->get_option(&#039;qr_code_url&#039;, &#039;https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/bitcoin-qr-reflection-elite.jpg&#039;);
            $this->instructions = $this->get_option(&#039;instructions&#039;, &#039;Please transfer the equivalent amount in Bitcoin (BTC) to our wallet address. Your order will be placed on hold until confirmed on the blockchain.&#039;);

            // Save admin options
            add_action(&#039;woocommerce_update_options_payment_gateways_&#039; . $this->id, array($this, &#039;process_admin_options&#039;));

            // Thankyou page & Emails
            add_action(&#039;woocommerce_thankyou_&#039; . $this->id, array($this, &#039;thankyou_page&#039;));
            add_action(&#039;woocommerce_email_before_order_table&#039;, array($this, &#039;email_instructions&#039;), 10, 3);
        }

        public function init_form_fields() {
            $this->form_fields = array(
                &#039;enabled&#039; => array(
                    &#039;title&#039;   => __(&#039;Enable/Disable&#039;, &#039;woocommerce&#039;),
                    &#039;type&#039;    => &#039;checkbox&#039;,
                    &#039;label&#039;   => __(&#039;Enable Bitcoin Payment&#039;, &#039;woocommerce&#039;),
                    &#039;default&#039; => &#039;yes&#039;,
                ),
                &#039;title&#039; => array(
                    &#039;title&#039;       => __(&#039;Title&#039;, &#039;woocommerce&#039;),
                    &#039;type&#039;        => &#039;text&#039;,
                    &#039;description&#039; => __(&#039;Payment method title displayed during checkout.&#039;, &#039;woocommerce&#039;),
                    &#039;default&#039;     => __(&#039;Pay with Bitcoin (BTC)&#039;, &#039;woocommerce&#039;),
                    &#039;desc_tip&#039;    => true,
                ),
                &#039;description&#039; => array(
                    &#039;title&#039;       => __(&#039;Description&#039;, &#039;woocommerce&#039;),
                    &#039;type&#039;        => &#039;textarea&#039;,
                    &#039;description&#039; => __(&#039;Payment method description displayed during checkout.&#039;, &#039;woocommerce&#039;),
                    &#039;default&#039;     => __(&#039;Pay directly using Bitcoin (BTC) to our secure wallet. Instant scannable QR code and copyable address provided.&#039;, &#039;woocommerce&#039;),
                ),
                &#039;btc_address&#039; => array(
                    &#039;title&#039;       => __(&#039;Bitcoin Receiving Address&#039;, &#039;woocommerce&#039;),
                    &#039;type&#039;        => &#039;text&#039;,
                    &#039;description&#039; => __(&#039;Your Bitcoin receiving address.&#039;, &#039;woocommerce&#039;),
                    &#039;default&#039;     => &#039;bc1q2thh6pmgxlwzjhmh4k4e5tdsz8hwqdwqe40xwg&#039;,
                ),
                &#039;qr_code_url&#039; => array(
                    &#039;title&#039;       => __(&#039;QR Code Image URL&#039;, &#039;woocommerce&#039;),
                    &#039;type&#039;        => &#039;text&#039;,
                    &#039;description&#039; => __(&#039;URL to your Bitcoin QR Code image.&#039;, &#039;woocommerce&#039;),
                    &#039;default&#039;     => &#039;https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/bitcoin-qr-reflection-elite.jpg&#039;,
                ),
                &#039;instructions&#039; => array(
                    &#039;title&#039;       => __(&#039;Instructions&#039;, &#039;woocommerce&#039;),
                    &#039;type&#039;        => &#039;textarea&#039;,
                    &#039;description&#039; => __(&#039;Instructions shown on order confirmation page and emails.&#039;, &#039;woocommerce&#039;),
                    &#039;default&#039;     => __(&#039;Please transfer the equivalent amount in Bitcoin (BTC) to our wallet address. Your order will be placed on hold until confirmed on the blockchain.&#039;, &#039;woocommerce&#039;),
                ),
            );
        }

        public function payment_fields() {
            if ($this->description) {
                echo &#039;<p style="color: #94a3b8; font-size: 13px; margin-bottom: 12px; line-height: 1.5;">&#039; . wp_kses_post($this->description) . &#039;</p>&#039;;
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
                    <div style="background: #090c12; border: 1px dashed rgba(212, 175, 55, 0.5); border-radius: 8px; padding: 10px 14px; font-family: &#039;Courier New&#039;, Courier, monospace; font-size: 13px; color: #f3e5ab; word-break: break-all; user-select: all; line-height: 1.4;" id="re-btc-address-val"><?php echo $addr; ?></div>
                </div>

                <div style="margin-top: 10px;">
                    <button type="button" id="re-copy-btc-btn" onclick="(function(btn){
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(&#039;<?php echo $addr; ?>&#039;).then(function(){
                                btn.innerText = &#039;✓ Address Copied!&#039;;
                                btn.style.background = &#039;#22c55e&#039;;
                                btn.style.color = &#039;#ffffff&#039;;
                                setTimeout(function(){
                                    btn.innerText = &#039;Copy BTC Address&#039;;
                                    btn.style.background = &#039;linear-gradient(135deg, #d4af37, #aa820a)&#039;;
                                    btn.style.color = &#039;#090c12&#039;;
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
            $order->update_status(&#039;on-hold&#039;, sprintf(__(&#039;Awaiting Bitcoin payment to address: %s&#039;, &#039;woocommerce&#039;), $this->btc_address));

            // Reduce stock
            wc_reduce_stock_levels($order_id);

            // Empty cart
            WC()->cart->empty_cart();

            return array(
                &#039;result&#039;   => &#039;success&#039;,
                &#039;redirect&#039; => $this->get_return_url($order),
            );
        }

        public function thankyou_page($order_id) {
            $order = wc_get_order($order_id);
            if ($this->instructions) {
                echo &#039;<div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 8px; padding: 14px; margin-bottom: 20px; color: #f3e5ab; font-size: 14px;">&#039;;
                echo &#039;<strong>Payment Notice:</strong> &#039; . wpautop(wptexturize($this->instructions));
                echo &#039;</div>&#039;;
            }
            $this->render_bitcoin_box($order);
        }

        public function email_instructions($order, $sent_to_admin, $plain_text = false) {
            if ($sent_to_admin || &#039;on-hold&#039; !== $order->get_status() || $this->id !== $order->get_payment_method()) {
                return;
            }
            if ($this->instructions) {
                echo wpautop(wptexturize($this->instructions)) . PHP_EOL;
            }
            echo &#039;<p><strong>Bitcoin Receiving Address:</strong> &#039; . esc_html($this->btc_address) . &#039;</p>&#039;;
        }
    }
}

add_filter(&#039;woocommerce_payment_gateways&#039;, &#039;re_add_bitcoin_gateway_class&#039;);
function re_add_bitcoin_gateway_class($gateways) {
    if (class_exists(&#039;WC_Payment_Gateway&#039;)) {
        re_init_bitcoin_gateway_class();
    }
    $gateways[] = &#039;WC_Gateway_Bitcoin_RE&#039;;
    return $gateways;
}


// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V3
/**
 * Completely suppress native WooCommerce archive product loop on /shop/
 * Ensures 0 junk products, 0 duplicate sorting/count chrome, and pure Page 6 presentation.
 */
add_filter( &#039;woocommerce_product_loop&#039;, &#039;re_disable_shop_product_loop&#039;, 999 );
function re_disable_shop_product_loop( $is_loop ) {
    if ( function_exists( &#039;is_shop&#039; ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        return false;
    }
    return $is_loop;
}

add_action( &#039;woocommerce_before_shop_loop&#039;, &#039;re_remove_shop_loop_chrome&#039;, 1 );
function re_remove_shop_loop_chrome() {
    if ( function_exists( &#039;is_shop&#039; ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        remove_action( &#039;woocommerce_before_shop_loop&#039;, &#039;woocommerce_result_count&#039;, 20 );
        remove_action( &#039;woocommerce_before_shop_loop&#039;, &#039;woocommerce_catalog_ordering&#039;, 30 );
    }
}

add_action( &#039;woocommerce_no_products_found&#039;, &#039;re_remove_no_products_found_on_shop&#039;, 1 );
function re_remove_no_products_found_on_shop() {
    if ( function_exists( &#039;is_shop&#039; ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        remove_action( &#039;woocommerce_no_products_found&#039;, &#039;wc_no_products_found&#039;, 10 );
    }
}
