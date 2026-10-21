<?php
/**
 * Plugin Name: Reflection Elite Payment & Discount System
 * Description: Enterprise-grade flexible payment & discount engine (Scenarios A, B, and C) with WooCommerce Admin Settings.
 * Version: 1.0.0
 * Author: Reflection Elite Atelier
 * Text Domain: re-gateway-discounts
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('RE_PAYMENTS_VERSION')) {
    define('RE_PAYMENTS_VERSION', '1.0.0');
}

/**
 * --------------------------------------------------------------------------
 * 1. ADMIN SETTINGS PANEL (WooCommerce Settings Tab: Payment Scenarios)
 * --------------------------------------------------------------------------
 */
if (!class_exists('RE_Admin_Settings')) {
    class RE_Admin_Settings {

        public static function init() {
            add_filter('woocommerce_settings_tabs_array', array(__CLASS__, 'add_settings_tab'), 50);
            add_action('woocommerce_settings_tabs_re_payments', array(__CLASS__, 'render_settings_tab'));
            add_action('woocommerce_update_options_re_payments', array(__CLASS__, 'save_settings'));
        }

        public static function add_settings_tab($tabs) {
            $tabs['re_payments'] = __('Payment Scenarios', 're-gateway-discounts');
            return $tabs;
        }

        public static function get_settings() {
            return array(
                // General & Sandbox Section
                array(
                    'title' => __('Reflection Elite Flexible Payment Engine', 're-gateway-discounts'),
                    'type'  => 'title',
                    'desc'  => __('Configure and toggle the 3 independent payment scenarios. Adjust discount percentages, deposit amounts, and category overrides without code changes.', 're-gateway-discounts'),
                    'id'    => 're_payments_section_general'
                ),
                array(
                    'title'   => __('Admin Sandbox Mode', 're-gateway-discounts'),
                    'desc'    => __('Enable to test payment scenarios without affecting public visitors. When enabled, scenarios and discounts only appear for logged-in administrators or URLs with <code>?re_test_mode=1</code>.', 're-gateway-discounts'),
                    'id'      => 're_sandbox_mode',
                    'default' => 'no',
                    'type'    => 'checkbox'
                ),
                array(
                    'title'   => __('Coupon Stacking Policy', 're-gateway-discounts'),
                    'desc'    => __('Define how the payment discount interacts with promotional coupons.', 're-gateway-discounts'),
                    'id'      => 're_coupon_stacking_mode',
                    'default' => 'net',
                    'type'    => 'select',
                    'options' => array(
                        'net'       => __('Calculate payment discount on Net Subtotal after coupon deductions (Recommended)', 're-gateway-discounts'),
                        'exclusive' => __('Exclusive: Suppress payment discount if any promo coupon is applied', 're-gateway-discounts'),
                    )
                ),
                array('type' => 'sectionend', 'id' => 're_payments_section_general'),

                // Scenario A: Full Payment Discount
                array(
                    'title' => __('Scenario A: Full Payment Discount (Store-wide)', 're-gateway-discounts'),
                    'type'  => 'title',
                    'desc'  => __('Customer pays 100% online via Razorpay at checkout and receives an instant discount.', 're-gateway-discounts'),
                    'id'    => 're_payments_section_a'
                ),
                array(
                    'title'   => __('Enable Scenario A', 're-gateway-discounts'),
                    'desc'    => __('Activate store-wide Full Online Payment discount.', 're-gateway-discounts'),
                    'id'      => 're_scenario_a_enabled',
                    'default' => 'yes',
                    'type'    => 'checkbox'
                ),
                array(
                    'title'   => __('Discount Percentage (%)', 're-gateway-discounts'),
                    'desc'    => __('Discount applied when 100% full online payment is chosen (e.g., 5).', 're-gateway-discounts'),
                    'id'      => 're_scenario_a_discount',
                    'default' => '5',
                    'type'    => 'number',
                    'custom_attributes' => array('step' => '0.1', 'min' => '0', 'max' => '50')
                ),
                array(
                    'title'   => __('Checkout Label', 're-gateway-discounts'),
                    'desc'    => __('Label displayed on the checkout breakdown line item.', 're-gateway-discounts'),
                    'id'      => 're_scenario_a_label',
                    'default' => 'Full Online Payment Discount (5%)',
                    'type'    => 'text'
                ),
                array('type' => 'sectionend', 'id' => 're_payments_section_a'),

                // Scenario B: Partial Deposit
                array(
                    'title' => __('Scenario B: Partial Payment Deposit (Store-wide)', 're-gateway-discounts'),
                    'type'  => 'title',
                    'desc'  => __('Customer pays 50% now as deposit, balance due prior to dispatch. Applies a smaller discount and sets status to "Deposit Paid — Balance Due".', 're-gateway-discounts'),
                    'id'    => 're_payments_section_b'
                ),
                array(
                    'title'   => __('Enable Scenario B', 're-gateway-discounts'),
                    'desc'    => __('Offer partial advance deposit option at checkout.', 're-gateway-discounts'),
                    'id'      => 're_scenario_b_enabled',
                    'default' => 'yes',
                    'type'    => 'checkbox'
                ),
                array(
                    'title'   => __('Deposit Percentage (%)', 're-gateway-discounts'),
                    'desc'    => __('Percentage of the order required as immediate deposit (e.g., 50).', 're-gateway-discounts'),
                    'id'      => 're_scenario_b_deposit',
                    'default' => '50',
                    'type'    => 'number',
                    'custom_attributes' => array('step' => '1', 'min' => '10', 'max' => '90')
                ),
                array(
                    'title'   => __('Deposit Discount Percentage (%)', 're-gateway-discounts'),
                    'desc'    => __('Discount applied when 50% deposit option is chosen (e.g., 3).', 're-gateway-discounts'),
                    'id'      => 're_scenario_b_discount',
                    'default' => '3',
                    'type'    => 'number',
                    'custom_attributes' => array('step' => '0.1', 'min' => '0', 'max' => '50')
                ),
                array(
                    'title'   => __('Checkout Label', 're-gateway-discounts'),
                    'desc'    => __('Label displayed on the checkout breakdown line item.', 're-gateway-discounts'),
                    'id'      => 're_scenario_b_label',
                    'default' => 'Advance Booking Discount (3%)',
                    'type'    => 'text'
                ),
                array('type' => 'sectionend', 'id' => 're_payments_section_b'),

                // Scenario C: Venetian Mirrors Category Override
                array(
                    'title' => __('Scenario C: Venetian Mirrors Category Override', 're-gateway-discounts'),
                    'type'  => 'title',
                    'desc'  => __('Rules for bespoke handcrafted Venetian Mirrors: "Book Now" CTA, strictly no Cash on Delivery, and exclusive 50% advance / 100% full payment selection.', 're-gateway-discounts'),
                    'id'    => 're_payments_section_c'
                ),
                array(
                    'title'   => __('Enable Scenario C', 're-gateway-discounts'),
                    'desc'    => __('Activate bespoke category overrides for Venetian Mirrors.', 're-gateway-discounts'),
                    'id'      => 're_scenario_c_enabled',
                    'default' => 'yes',
                    'type'    => 'checkbox'
                ),
                array(
                    'title'   => __('Target Category Slug', 're-gateway-discounts'),
                    'desc'    => __('Category slug for Venetian Mirrors (default: <code>venetian-mirror</code>).', 're-gateway-discounts'),
                    'id'      => 're_scenario_c_category',
                    'default' => 'venetian-mirror',
                    'type'    => 'text'
                ),
                array(
                    'title'   => __('Button Label Override', 're-gateway-discounts'),
                    'desc'    => __('Replaces "Add to Cart" / "Buy Now" on Venetian Mirrors with this label.', 're-gateway-discounts'),
                    'id'      => 're_scenario_c_button_text',
                    'default' => 'Book Now',
                    'type'    => 'text'
                ),
                array(
                    'title'   => __('Disable Cash on Delivery (COD)', 're-gateway-discounts'),
                    'desc'    => __('Strictly disable COD whenever any Venetian Mirror product is in the cart.', 're-gateway-discounts'),
                    'id'      => 're_scenario_c_disable_cod',
                    'default' => 'yes',
                    'type'    => 'checkbox'
                ),
                array('type' => 'sectionend', 'id' => 're_payments_section_c')
            );
        }

        public static function render_settings_tab() {
            if (function_exists('woocommerce_admin_fields')) {
                woocommerce_admin_fields(self::get_settings());
            }
        }

        public static function save_settings() {
            if (function_exists('woocommerce_update_options')) {
                woocommerce_update_options(self::get_settings());
            }
        }

        public static function is_feature_active() {
            $sandbox = get_option('re_sandbox_mode', 'no');
            if ('yes' === $sandbox) {
                if (isset($_GET['re_test_mode']) && '1' === $_GET['re_test_mode']) {
                    if (function_exists('WC') && WC()->session) {
                        WC()->session->set('re_test_mode', '1');
                    }
                    if (!headers_sent()) {
                        setcookie('re_test_mode', '1', time() + 86400, '/');
                    }
                    return true;
                }
                if (function_exists('WC') && WC()->session && '1' === WC()->session->get('re_test_mode')) {
                    return true;
                }
                if (isset($_COOKIE['re_test_mode']) && '1' === $_COOKIE['re_test_mode']) {
                    return true;
                }
                if (current_user_can('manage_woocommerce')) {
                    return true;
                }
                return false;
            }
            return true;
        }
    }
}

/**
 * --------------------------------------------------------------------------
 * 2. CATEGORY OVERRIDES FOR VENETIAN MIRRORS (Scenario C)
 * --------------------------------------------------------------------------
 */
if (!class_exists('RE_Category_Override')) {
    class RE_Category_Override {

        public static function init() {
            add_filter('woocommerce_product_single_add_to_cart_text', array(__CLASS__, 'override_button_text'), 20, 2);
            add_filter('woocommerce_product_add_to_cart_text', array(__CLASS__, 'override_button_text'), 20, 2);
        }

        public static function is_venetian_product($product_id) {
            $scenario_c_enabled = get_option('re_scenario_c_enabled', 'yes');
            if ('yes' !== $scenario_c_enabled) {
                return false;
            }

            if (!RE_Admin_Settings::is_feature_active()) {
                return false;
            }

            $category_slug = get_option('re_scenario_c_category', 'venetian-mirror');
            return has_term($category_slug, 'product_cat', $product_id);
        }

        public static function cart_has_venetian() {
            if (!function_exists('WC') || !WC()->cart) {
                return false;
            }

            foreach (WC()->cart->get_cart() as $cart_item) {
                $product_id = !empty($cart_item['variation_id']) ? $cart_item['variation_id'] : $cart_item['product_id'];
                $parent_id  = $cart_item['product_id'];
                if (self::is_venetian_product($product_id) || self::is_venetian_product($parent_id)) {
                    return true;
                }
            }
            return false;
        }

        public static function override_button_text($text, $product) {
            if (!$product) {
                return $text;
            }

            $product_id = $product->get_id();
            if (self::is_venetian_product($product_id)) {
                $custom_btn = get_option('re_scenario_c_button_text', 'Book Now');
                return !empty($custom_btn) ? esc_html($custom_btn) : __('Book Now', 're-gateway-discounts');
            }

            return $text;
        }
    }
}

/**
 * --------------------------------------------------------------------------
 * 3. CHECKOUT OVERRIDES & PAYMENT PLAN SELECTOR
 * --------------------------------------------------------------------------
 */
if (!class_exists('RE_Checkout_Overrides')) {
    class RE_Checkout_Overrides {

        public static function init() {
            add_filter('woocommerce_available_payment_gateways', array(__CLASS__, 'filter_payment_gateways'), 25);
            add_action('woocommerce_review_order_before_payment', array(__CLASS__, 'render_payment_plan_selector'), 15);
            add_action('wp_ajax_re_set_payment_plan', array(__CLASS__, 'ajax_set_payment_plan'));
            add_action('wp_ajax_nopriv_re_set_payment_plan', array(__CLASS__, 'ajax_set_payment_plan'));
            add_action('woocommerce_checkout_create_order', array(__CLASS__, 'save_order_payment_plan'), 10, 2);
            add_action('woocommerce_before_checkout_form', array(__CLASS__, 'render_venetian_checkout_notice'), 10);
        }

        public static function filter_payment_gateways($gateways) {
            if (is_admin()) {
                return $gateways;
            }

            if (!RE_Admin_Settings::is_feature_active()) {
                return $gateways;
            }

            $scenario_c_enabled = get_option('re_scenario_c_enabled', 'yes');
            $disable_cod        = get_option('re_scenario_c_disable_cod', 'yes');

            if ('yes' === $scenario_c_enabled && 'yes' === $disable_cod) {
                if (RE_Category_Override::cart_has_venetian()) {
                    if (isset($gateways['cod'])) {
                        unset($gateways['cod']);
                    }
                }
            }

            return $gateways;
        }

        public static function render_venetian_checkout_notice() {
            if (!RE_Admin_Settings::is_feature_active()) {
                return;
            }

            if (RE_Category_Override::cart_has_venetian()) {
                echo '<div class="woocommerce-info re-venetian-policy-notice" style="background:#0f1523; border:1px solid rgba(212,175,55,0.4); border-left:4px solid #d4af37; color:#e2e8f0; padding:14px 18px; margin-bottom:24px; border-radius:6px; font-size:14px;">';
                echo '⚜️ <strong style="color:#f5e7a9; font-family:\'Cinzel\',serif;">Bespoke Venetian Mirror Atelier Notice:</strong><br />';
                echo 'Your cart contains handcrafted Venetian mirror pieces requiring moisture-sealed backing and reinforced wooden crating. Per atelier policy, orders are eligible exclusively for <strong>100% Full Payment (5% Discount)</strong> or <strong>50% Advance Booking (3% Discount)</strong> via secure Razorpay checkout. Cash on Delivery is disabled.';
                echo '</div>';
            }
        }

        public static function render_payment_plan_selector() {
            if (!RE_Admin_Settings::is_feature_active()) {
                return;
            }

            $scenario_a = get_option('re_scenario_a_enabled', 'yes');
            $scenario_b = get_option('re_scenario_b_enabled', 'yes');

            if ('yes' !== $scenario_a && 'yes' !== $scenario_b) {
                return;
            }

            $discount_a = floatval(get_option('re_scenario_a_discount', 5));
            $discount_b = floatval(get_option('re_scenario_b_discount', 3));
            $deposit_b  = floatval(get_option('re_scenario_b_deposit', 50));

            $current_plan = (function_exists('WC') && WC()->session) ? WC()->session->get('re_payment_plan', 'full') : 'full';
            if ('yes' !== $scenario_a && 'yes' === $scenario_b) {
                $current_plan = 'deposit';
            }

            ?>
            <div id="re-payment-plan-box" style="background:#0d121c; border:1px solid rgba(212,175,55,0.35); border-radius:10px; padding:20px; margin:20px 0 25px 0; box-shadow:0 8px 25px rgba(0,0,0,0.5);">
                <h3 style="font-family:'Cinzel',serif; font-size:16px; color:#f5e7a9; margin:0 0 14px 0; letter-spacing:1px; text-transform:uppercase; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:8px;">
                    ✨ Select Your Payment Structure
                </h3>

                <div style="display:flex; flex-direction:column; gap:12px;">
                    <?php if ('yes' === $scenario_a) : ?>
                    <label style="display:flex; align-items:flex-start; gap:12px; cursor:pointer; background:<?php echo ('full' === $current_plan) ? '#161e2e' : '#101522'; ?>; border:1px solid <?php echo ('full' === $current_plan) ? '#d4af37' : 'rgba(255,255,255,0.1)'; ?>; padding:14px; border-radius:8px; transition:all 0.2s ease;">
                        <input type="radio" name="re_payment_plan_choice" value="full" <?php checked($current_plan, 'full'); ?> style="margin-top:3px;" />
                        <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:#ffffff; font-size:14px;">Pay 100% Full Payment Online</strong>
                                <span style="background:linear-gradient(135deg, #f5d77f, #d4af37); color:#07090d; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:4px; text-transform:uppercase; letter-spacing:0.5px;">Save <?php echo esc_html($discount_a); ?>%</span>
                            </div>
                            <p style="margin:4px 0 0 0; font-size:12px; color:#94a3b8; line-height:1.4;">Pay 100% online via Razorpay (UPI, Credit/Debit Cards, NetBanking). Highest discount automatically applied to your order.</p>
                        </div>
                    </label>
                    <?php endif; ?>

                    <?php if ('yes' === $scenario_b) : ?>
                    <label style="display:flex; align-items:flex-start; gap:12px; cursor:pointer; background:<?php echo ('deposit' === $current_plan) ? '#161e2e' : '#101522'; ?>; border:1px solid <?php echo ('deposit' === $current_plan) ? '#d4af37' : 'rgba(255,255,255,0.1)'; ?>; padding:14px; border-radius:8px; transition:all 0.2s ease;">
                        <input type="radio" name="re_payment_plan_choice" value="deposit" <?php checked($current_plan, 'deposit'); ?> style="margin-top:3px;" />
                        <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:#ffffff; font-size:14px;">Pay <?php echo esc_html($deposit_b); ?>% Advance Deposit Now</strong>
                                <span style="background:rgba(212,175,55,0.2); border:1px solid rgba(212,175,55,0.5); color:#f5e7a9; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:4px; text-transform:uppercase; letter-spacing:0.5px;">Save <?php echo esc_html($discount_b); ?>%</span>
                            </div>
                            <p style="margin:4px 0 0 0; font-size:12px; color:#94a3b8; line-height:1.4;">Pay <?php echo esc_html($deposit_b); ?>% now to initiate fabrication. Remaining <?php echo esc_html(100 - $deposit_b); ?>% balance is payable prior to final wooden-crated dispatch via a secure follow-up link.</p>
                        </div>
                    </label>
                    <?php endif; ?>
                </div>
            </div>

            <script type="text/javascript">
            jQuery(function($) {
                $(document).on('change', 'input[name="re_payment_plan_choice"]', function() {
                    var plan = $(this).val();
                    $.ajax({
                        type: 'POST',
                        url: '<?php echo esc_url(admin_url('admin-ajax.php')); ?>',
                        data: {
                            action: 're_set_payment_plan',
                            plan: plan
                        },
                        success: function() {
                            $('body').trigger('update_checkout');
                        }
                    });
                });
            });
            </script>
            <?php
        }

        public static function ajax_set_payment_plan() {
            if (isset($_POST['plan']) && in_array($_POST['plan'], array('full', 'deposit'))) {
                if (function_exists('WC') && WC()->session) {
                    WC()->session->set('re_payment_plan', sanitize_text_field($_POST['plan']));
                }
            }
            wp_send_json_success();
        }

        public static function save_order_payment_plan($order, $data) {
            $plan = (function_exists('WC') && WC()->session) ? WC()->session->get('re_payment_plan', 'full') : 'full';
            $order->update_meta_data('_re_payment_plan', $plan);
        }
    }
}

/**
 * --------------------------------------------------------------------------
 * 4. DYNAMIC DISCOUNTS & FEE ENGINE (Scenarios A & B)
 * --------------------------------------------------------------------------
 */
if (!class_exists('RE_Discounts')) {
    class RE_Discounts {

        public static function init() {
            add_action('woocommerce_cart_calculate_fees', array(__CLASS__, 'apply_payment_scenarios_discounts'), 20, 1);
        }

        public static function apply_payment_scenarios_discounts($cart) {
            if (is_admin() && !defined('DOING_AJAX')) {
                return;
            }

            if (!RE_Admin_Settings::is_feature_active()) {
                return;
            }

            $chosen_gateway = (function_exists('WC') && WC()->session) ? WC()->session->get('chosen_payment_method') : '';
            if ('cod' === $chosen_gateway) {
                return;
            }

            $plan = (function_exists('WC') && WC()->session) ? WC()->session->get('re_payment_plan', 'full') : 'full';

            $coupons = $cart->get_coupons();
            $stacking_mode = get_option('re_coupon_stacking_mode', 'net');

            if (!empty($coupons) && 'exclusive' === $stacking_mode) {
                return;
            }

            $subtotal = $cart->get_subtotal();
            $discount_total = $cart->get_discount_total();
            $net_subtotal = max(0, $subtotal - $discount_total);

            if ($net_subtotal <= 0) {
                return;
            }

            // Scenario A: Full Payment Discount
            if ('full' === $plan) {
                $scenario_a = get_option('re_scenario_a_enabled', 'yes');
                if ('yes' === $scenario_a) {
                    $rate = floatval(get_option('re_scenario_a_discount', 5));
                    if ($rate > 0) {
                        $discount_amount = round(($net_subtotal * ($rate / 100)), 2);
                        $label = get_option('re_scenario_a_label', 'Full Online Payment Discount (5%)');
                        $cart->add_fee($label, -$discount_amount, false);
                    }
                }
            }
            // Scenario B: Deposit (50% Advance)
            elseif ('deposit' === $plan) {
                $scenario_b = get_option('re_scenario_b_enabled', 'yes');
                if ('yes' === $scenario_b) {
                    $rate = floatval(get_option('re_scenario_b_discount', 3));
                    $deposit_pct = floatval(get_option('re_scenario_b_deposit', 50));

                    $discount_amount = 0;
                    if ($rate > 0) {
                        $discount_amount = round(($net_subtotal * ($rate / 100)), 2);
                        $label = get_option('re_scenario_b_label', 'Advance Booking Discount (3%)');
                        $cart->add_fee($label, -$discount_amount, false);
                    }

                    $discounted_order_value = max(0, $net_subtotal - $discount_amount);
                    $shipping_total = $cart->get_shipping_total();
                    $grand_total_estimate = $discounted_order_value + $shipping_total;

                    $deposit_fraction = $deposit_pct / 100;
                    $immediate_deposit_due = round($grand_total_estimate * $deposit_fraction, 2);
                    $remaining_balance = round($grand_total_estimate - $immediate_deposit_due, 2);

                    if ($remaining_balance > 0) {
                        $balance_label = sprintf(__('Remaining Balance Due Prior to Dispatch (%d%%)', 're-gateway-discounts'), (100 - $deposit_pct));
                        $cart->add_fee($balance_label, -$remaining_balance, false);

                        if (function_exists('WC') && WC()->session) {
                            WC()->session->set('re_calculated_remaining_balance', $remaining_balance);
                            WC()->session->set('re_calculated_deposit_paid', $immediate_deposit_due);
                        }
                    }
                }
            }
        }
    }
}

/**
 * --------------------------------------------------------------------------
 * 5. DEPOSIT & BALANCE DUE LIFECYCLE MANAGER (Scenario B)
 * --------------------------------------------------------------------------
 */
if (!class_exists('RE_Deposit_Manager')) {
    class RE_Deposit_Manager {

        public static function init() {
            add_action('woocommerce_checkout_create_order', array(__CLASS__, 'save_deposit_order_meta'), 20, 2);
            add_action('woocommerce_payment_complete', array(__CLASS__, 'handle_deposit_payment_complete'), 20, 1);
            add_action('woocommerce_order_status_processing', array(__CLASS__, 'maybe_set_deposit_paid_status'), 20, 1);
            add_action('woocommerce_thankyou', array(__CLASS__, 'render_thankyou_balance_box'), 15, 1);
            add_action('woocommerce_email_after_order_table', array(__CLASS__, 'render_email_balance_box'), 15, 4);
            add_action('add_meta_boxes', array(__CLASS__, 'add_admin_balance_metabox'));
        }

        public static function save_deposit_order_meta($order, $data) {
            $plan = (function_exists('WC') && WC()->session) ? WC()->session->get('re_payment_plan', 'full') : 'full';
            
            if ('deposit' === $plan) {
                $deposit_paid = (function_exists('WC') && WC()->session) ? floatval(WC()->session->get('re_calculated_deposit_paid', 0)) : 0;
                $remaining    = (function_exists('WC') && WC()->session) ? floatval(WC()->session->get('re_calculated_remaining_balance', 0)) : 0;

                $order->update_meta_data('_re_is_deposit', 'yes');
                $order->update_meta_data('_re_deposit_amount_paid', $deposit_paid);
                $order->update_meta_data('_re_remaining_balance', $remaining);
                $order->update_meta_data('_re_balance_status', 'pending');
            }
        }

        public static function handle_deposit_payment_complete($order_id) {
            $order = function_exists('wc_get_order') ? wc_get_order($order_id) : null;
            if (!$order) {
                return;
            }

            if ('yes' === $order->get_meta('_re_is_deposit') && 'pending' === $order->get_meta('_re_balance_status')) {
                self::ensure_balance_order_created($order);
                $order->update_status('deposit-paid', __('50% Advance deposit captured via Razorpay. Order placed in "Deposit Paid — Balance Due" awaiting final clearance.', 're-gateway-discounts'));
            }
        }

        public static function maybe_set_deposit_paid_status($order_id) {
            $order = function_exists('wc_get_order') ? wc_get_order($order_id) : null;
            if (!$order) {
                return;
            }

            if ('yes' === $order->get_meta('_re_is_deposit') && 'pending' === $order->get_meta('_re_balance_status')) {
                self::ensure_balance_order_created($order);
                remove_action('woocommerce_order_status_processing', array(__CLASS__, 'maybe_set_deposit_paid_status'), 20);
                $order->update_status('deposit-paid', __('50% Advance deposit captured. Order placed in "Deposit Paid — Balance Due".', 're-gateway-discounts'));
                add_action('woocommerce_order_status_processing', array(__CLASS__, 'maybe_set_deposit_paid_status'), 20);
            }
        }

        public static function ensure_balance_order_created($parent_order) {
            $existing_child_id = $parent_order->get_meta('_re_balance_child_order_id');
            if (!empty($existing_child_id) && function_exists('wc_get_order') && wc_get_order($existing_child_id)) {
                return;
            }

            $remaining_amount = floatval($parent_order->get_meta('_re_remaining_balance'));
            if ($remaining_amount <= 0) {
                return;
            }

            try {
                if (!function_exists('wc_create_order')) {
                    return;
                }

                $child_order = wc_create_order(array(
                    'customer_id'   => $parent_order->get_customer_id(),
                    'parent'        => $parent_order->get_id(),
                    'status'        => 'pending',
                    'customer_note' => sprintf(__('Remaining 50%% Balance Payment for Order #%s', 're-gateway-discounts'), $parent_order->get_order_number())
                ));

                $child_order->set_address($parent_order->get_address('billing'), 'billing');
                $child_order->set_address($parent_order->get_address('shipping'), 'shipping');

                if (class_exists('WC_Order_Item_Fee')) {
                    $item = new WC_Order_Item_Fee();
                    $item->set_name(sprintf(__('Remaining 50%% Balance Due (Order #%s)', 're-gateway-discounts'), $parent_order->get_order_number()));
                    $item->set_amount($remaining_amount);
                    $item->set_total($remaining_amount);
                    $child_order->add_item($item);
                }

                $child_order->set_currency($parent_order->get_currency());
                $child_order->calculate_totals();
                $child_order->update_meta_data('_re_is_balance_order', 'yes');
                $child_order->update_meta_data('_re_parent_order_id', $parent_order->get_id());
                $child_order->save();

                $pay_url = $child_order->get_checkout_payment_url(true);

                $parent_order->update_meta_data('_re_balance_child_order_id', $child_order->get_id());
                $parent_order->update_meta_data('_re_balance_payment_url', $pay_url);
                $parent_order->save();

            } catch (Exception $e) {
                error_log('[Reflection Elite Payments] Error generating balance order: ' . $e->getMessage());
            }
        }

        public static function render_thankyou_balance_box($order_id) {
            $order = function_exists('wc_get_order') ? wc_get_order($order_id) : null;
            if (!$order || 'yes' !== $order->get_meta('_re_is_deposit')) {
                return;
            }

            $balance = floatval($order->get_meta('_re_remaining_balance'));
            $pay_url = $order->get_meta('_re_balance_payment_url');

            echo '<div style="background:#111726; border:1px solid rgba(212,175,55,0.4); border-radius:10px; padding:22px; margin:24px 0; color:#e2e8f0; box-shadow:0 10px 30px rgba(0,0,0,0.6);">';
            echo '<h3 style="font-family:\'Cinzel\',serif; color:#f5e7a9; margin:0 0 10px 0; font-size:18px;">👑 Handcrafted Advance Deposit Confirmed</h3>';
            echo '<p style="margin:0 0 14px 0; font-size:14px; line-height:1.6;">Thank you for your order! Your <strong>50% advance deposit</strong> has been received, and our artisans in Goa have commenced precision cutting and hand-beveling for your luxury mirror.</p>';
            echo '<div style="background:#090d15; padding:14px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); margin-bottom:16px;">';
            echo '<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>Initial Deposit Paid:</span> <strong style="color:#22c55e;">' . (function_exists('wc_price') ? wc_price($order->get_total()) : $order->get_total()) . '</strong></div>';
            echo '<div style="display:flex; justify-content:space-between;"><span>Remaining Balance Due:</span> <strong style="color:#f5e7a9;">' . (function_exists('wc_price') ? wc_price($balance) : $balance) . '</strong></div>';
            echo '</div>';
            if (!empty($pay_url)) {
                echo '<p style="font-size:13px; color:#94a3b8; margin:0 0 10px 0;">You can clear your remaining balance prior to crated dispatch using your secure payment link below (also emailed to you):</p>';
                echo '<a href="' . esc_url($pay_url) . '" style="background:linear-gradient(135deg, #f5d77f, #d4af37); color:#07090d; font-family:\'Cinzel\',serif; font-weight:bold; font-size:13px; padding:10px 20px; border-radius:6px; text-decoration:none; display:inline-block; margin-top:4px;">Pay Remaining 50% Balance (Razorpay) →</a>';
            }
            echo '</div>';
        }

        public static function render_email_balance_box($order, $sent_to_admin, $plain_text, $email) {
            if (!$order || 'yes' !== $order->get_meta('_re_is_deposit')) {
                return;
            }

            $balance = floatval($order->get_meta('_re_remaining_balance'));
            $pay_url = $order->get_meta('_re_balance_payment_url');

            if ($plain_text) {
                echo "\n----------------------------------------\n";
                echo "DEPOSIT PAID — BALANCE DUE INFORMATION\n";
                echo "Initial 50% Deposit: " . (function_exists('wc_price') ? wc_price($order->get_total()) : $order->get_total()) . "\n";
                echo "Remaining Balance Due: " . (function_exists('wc_price') ? wc_price($balance) : $balance) . "\n";
                if (!empty($pay_url)) {
                    echo "Secure Balance Payment Link: " . $pay_url . "\n";
                }
                echo "----------------------------------------\n\n";
            } else {
                echo '<div style="background:#141b2b; border:1px solid #d4af37; padding:18px; border-radius:8px; margin:20px 0; color:#e2e8f0;">';
                echo '<h4 style="color:#f5e7a9; margin:0 0 8px 0; font-size:16px;">Deposit Paid — Balance Due Notice</h4>';
                echo '<p style="font-size:13px; margin:0 0 10px 0;">Initial 50% deposit received. Remaining balance of <strong>' . (function_exists('wc_price') ? wc_price($balance) : $balance) . '</strong> is due prior to final reinforced wooden crated dispatch.</p>';
                if (!empty($pay_url)) {
                    echo '<p><a href="' . esc_url($pay_url) . '" style="background:#d4af37; color:#000000; font-weight:bold; padding:8px 16px; border-radius:4px; text-decoration:none; display:inline-block;">Pay Remaining 50% Balance Now →</a></p>';
                }
                echo '</div>';
            }
        }

        public static function add_admin_balance_metabox() {
            add_meta_box(
                're_balance_due_metabox',
                __('Reflection Elite — 50% Deposit & Balance Due Controls', 're-gateway-discounts'),
                array(__CLASS__, 'render_admin_balance_metabox'),
                'shop_order',
                'side',
                'high'
            );
        }

        public static function render_admin_balance_metabox($post) {
            $order = function_exists('wc_get_order') ? wc_get_order($post->ID) : null;
            if (!$order || 'yes' !== $order->get_meta('_re_is_deposit')) {
                echo '<p style="color:#94a3b8; font-size:13px;">This order is a standard 100% full payment order.</p>';
                return;
            }

            $balance = floatval($order->get_meta('_re_remaining_balance'));
            $pay_url = $order->get_meta('_re_balance_payment_url');
            $phone   = $order->get_billing_phone();

            echo '<div style="font-size:13px; line-height:1.6;">';
            echo '<p style="margin:0 0 8px 0;"><strong>Remaining Balance:</strong> <span style="color:#d4af37; font-weight:bold;">' . (function_exists('wc_price') ? wc_price($balance) : $balance) . '</span></p>';
            
            if (!empty($pay_url)) {
                echo '<p style="margin:0 0 6px 0;"><strong>Customer Balance Payment Link:</strong></p>';
                echo '<input type="text" readonly value="' . esc_attr($pay_url) . '" style="width:100%; font-size:11px; margin-bottom:10px;" onclick="this.select();" />';
                
                if (!empty($phone)) {
                    $clean_phone = preg_replace('/[^0-9]/', '', $phone);
                    if (strlen($clean_phone) === 10) {
                        $clean_phone = '91' . $clean_phone;
                    }
                    $wa_msg = sprintf(
                        __("Hello %s, your bespoke luxury mirror from Reflection Elite is completing final polishing! Please use this link to clear your remaining 50%% balance of %s for crated dispatch: %s", 're-gateway-discounts'),
                        $order->get_billing_first_name(),
                        (function_exists('wc_price') ? strip_tags(wc_price($balance)) : $balance),
                        $pay_url
                    );
                    $wa_link = 'https://wa.me/' . $clean_phone . '?text=' . rawurlencode($wa_msg);
                    echo '<a href="' . esc_url($wa_link) . '" target="_blank" class="button button-primary" style="background:#25D366; border-color:#25D366; width:100%; text-align:center; margin-top:6px;">📲 Send WhatsApp Balance Link</a>';
                }
            }
            echo '</div>';
        }
    }
}

/**
 * --------------------------------------------------------------------------
 * 6. CORE PLUGIN BOOTSTRAPPER
 * --------------------------------------------------------------------------
 */
if (!class_exists('Reflection_Elite_Payments')) {
    class Reflection_Elite_Payments {

        private static $instance = null;

        public static function get_instance() {
            if (null === self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        private function __construct() {
            add_action('init', array($this, 'register_deposit_order_status'));
            add_filter('wc_order_statuses', array($this, 'add_deposit_order_status_to_list'));

            RE_Admin_Settings::init();
            RE_Category_Override::init();
            RE_Checkout_Overrides::init();
            RE_Discounts::init();
            RE_Deposit_Manager::init();
        }

        public function register_deposit_order_status() {
            register_post_status('wc-deposit-paid', array(
                'label'                     => _x('Deposit Paid — Balance Due', 'Order status', 're-gateway-discounts'),
                'public'                    => true,
                'exclude_from_search'       => false,
                'show_in_admin_all_list'    => true,
                'show_in_admin_status_list' => true,
                'label_count'               => _n_noop('Deposit Paid <span class="count">(%s)</span>', 'Deposit Paid <span class="count">(%s)</span>', 're-gateway-discounts')
            ));
        }

        public function add_deposit_order_status_to_list($order_statuses) {
            $new_statuses = array();
            foreach ($order_statuses as $key => $status) {
                $new_statuses[$key] = $status;
                if ('wc-processing' === $key) {
                    $new_statuses['wc-deposit-paid'] = _x('Deposit Paid — Balance Due', 'Order status', 're-gateway-discounts');
                }
            }
            if (!isset($new_statuses['wc-deposit-paid'])) {
                $new_statuses['wc-deposit-paid'] = _x('Deposit Paid — Balance Due', 'Order status', 're-gateway-discounts');
            }
            return $new_statuses;
        }
    }
}

add_action('plugins_loaded', array('Reflection_Elite_Payments', 'get_instance'));
