<?php
/**
 * Checkout Overrides & Payment Plan Selector
 */

if (!defined('ABSPATH')) {
    exit;
}

class RE_Checkout_Overrides {

    public static function init() {
        // Enforce gateway restrictions (Disable COD for Venetian Mirrors)
        add_filter('woocommerce_available_payment_gateways', array(__CLASS__, 'filter_payment_gateways'), 25);

        // Render payment option selector on checkout page
        add_action('woocommerce_review_order_before_payment', array(__CLASS__, 'render_payment_plan_selector'), 15);

        // Handle AJAX update when payment plan option is selected
        add_action('wp_ajax_re_set_payment_plan', array(__CLASS__, 'ajax_set_payment_plan'));
        add_action('wp_ajax_nopriv_re_set_payment_plan', array(__CLASS__, 'ajax_set_payment_plan'));

        // Save selected plan into order meta
        add_action('woocommerce_checkout_create_order', array(__CLASS__, 'save_order_payment_plan'), 10, 2);

        // Display notice on checkout if Venetian item is present
        add_action('woocommerce_before_checkout_form', array(__CLASS__, 'render_venetian_checkout_notice'), 10);
    }

    /**
     * Disable COD if cart has any Venetian Mirror product (Scenario C)
     */
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

    /**
     * Inform customer about Venetian Mirror bespoke policies at checkout
     */
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

    /**
     * Render the Luxury Payment Plan Radio Selector at checkout
     */
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

        // Get currently selected plan from session (default to 'full' if Scenario A enabled)
        $current_plan = WC()->session ? WC()->session->get('re_payment_plan', 'full') : 'full';
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

    /**
     * AJAX handler to store payment plan in WooCommerce session
     */
    public static function ajax_set_payment_plan() {
        if (isset($_POST['plan']) && in_array($_POST['plan'], array('full', 'deposit'))) {
            WC()->session->set('re_payment_plan', sanitize_text_field($_POST['plan']));
        }
        wp_send_json_success();
    }

    /**
     * Attach payment plan meta to the order
     */
    public static function save_order_payment_plan($order, $data) {
        $plan = WC()->session ? WC()->session->get('re_payment_plan', 'full') : 'full';
        $order->update_meta_data('_re_payment_plan', $plan);
    }
}
