<?php
/**
 * Admin Settings Panel for Reflection Elite Payment Scenarios
 */

if (!defined('ABSPATH')) {
    exit;
}

class RE_Admin_Settings {

    public static function init() {
        add_filter('woocommerce_settings_tabs_array', array(__CLASS__, 'add_settings_tab'), 50);
        add_action('woocommerce_settings_tabs_re_payments', array(__CLASS__, 'render_settings_tab'));
        add_action('woocommerce_update_options_re_payments', array(__CLASS__, 'save_settings'));
    }

    public static function add_settings_tab($tabs) {
        $tabs['re_payments'] = __('Payment Scenarios', 'reflection-elite-payments');
        return $tabs;
    }

    public static function get_settings() {
        return array(
            // SECTION: Master & Sandbox
            array(
                'title' => __('Reflection Elite Flexible Payment Engine', 'reflection-elite-payments'),
                'type'  => 'title',
                'desc'  => __('Configure and toggle the 3 independent payment scenarios. Adjust discount percentages, deposit amounts, and category overrides without code changes.', 'reflection-elite-payments'),
                'id'    => 're_payments_section_general'
            ),
            array(
                'title'   => __('Admin Sandbox Mode', 'reflection-elite-payments'),
                'desc'    => __('Enable to test payment scenarios without affecting public visitors. When enabled, scenarios and discounts only appear for logged-in administrators or URLs with <code>?re_test_mode=1</code>.', 'reflection-elite-payments'),
                'id'      => 're_sandbox_mode',
                'default' => 'no',
                'type'    => 'checkbox'
            ),
            array(
                'title'   => __('Coupon Stacking Policy', 'reflection-elite-payments'),
                'desc'    => __('Define how the payment discount interacts with promotional coupons.', 'reflection-elite-payments'),
                'id'      => 're_coupon_stacking_mode',
                'default' => 'net',
                'type'    => 'select',
                'options' => array(
                    'net'       => __('Calculate payment discount on Net Subtotal after coupon deductions (Recommended)', 'reflection-elite-payments'),
                    'exclusive' => __('Exclusive: Suppress payment discount if any promo coupon is applied', 'reflection-elite-payments'),
                )
            ),
            array('type' => 'sectionend', 'id' => 're_payments_section_general'),

            // SECTION: Scenario A
            array(
                'title' => __('Scenario A: Full Payment Discount (Store-wide)', 'reflection-elite-payments'),
                'type'  => 'title',
                'desc'  => __('Customer pays 100% online via Razorpay at checkout and receives an instant discount.', 'reflection-elite-payments'),
                'id'    => 're_payments_section_a'
            ),
            array(
                'title'   => __('Enable Scenario A', 'reflection-elite-payments'),
                'desc'    => __('Activate store-wide Full Online Payment discount.', 'reflection-elite-payments'),
                'id'      => 're_scenario_a_enabled',
                'default' => 'yes',
                'type'    => 'checkbox'
            ),
            array(
                'title'   => __('Discount Percentage (%)', 'reflection-elite-payments'),
                'desc'    => __('Discount applied when 100% full online payment is chosen (e.g., 5).', 'reflection-elite-payments'),
                'id'      => 're_scenario_a_discount',
                'default' => '5',
                'type'    => 'number',
                'custom_attributes' => array('step' => '0.1', 'min' => '0', 'max' => '50')
            ),
            array(
                'title'   => __('Checkout Label', 'reflection-elite-payments'),
                'desc'    => __('Label displayed on the checkout breakdown line item.', 'reflection-elite-payments'),
                'id'      => 're_scenario_a_label',
                'default' => 'Full Online Payment Discount (5%)',
                'type'    => 'text'
            ),
            array('type' => 'sectionend', 'id' => 're_payments_section_a'),

            // SECTION: Scenario B
            array(
                'title' => __('Scenario B: Partial Payment Deposit (Store-wide)', 'reflection-elite-payments'),
                'type'  => 'title',
                'desc'  => __('Customer pays 50% now as deposit, balance due prior to dispatch. Applies a smaller discount and sets status to "Deposit Paid — Balance Due".', 'reflection-elite-payments'),
                'id'    => 're_payments_section_b'
            ),
            array(
                'title'   => __('Enable Scenario B', 'reflection-elite-payments'),
                'desc'    => __('Offer partial advance deposit option at checkout.', 'reflection-elite-payments'),
                'id'      => 're_scenario_b_enabled',
                'default' => 'yes',
                'type'    => 'checkbox'
            ),
            array(
                'title'   => __('Deposit Percentage (%)', 'reflection-elite-payments'),
                'desc'    => __('Percentage of the order required as immediate deposit (e.g., 50).', 'reflection-elite-payments'),
                'id'      => 're_scenario_b_deposit',
                'default' => '50',
                'type'    => 'number',
                'custom_attributes' => array('step' => '1', 'min' => '10', 'max' => '90')
            ),
            array(
                'title'   => __('Deposit Discount Percentage (%)', 'reflection-elite-payments'),
                'desc'    => __('Discount applied when 50% deposit option is chosen (e.g., 3).', 'reflection-elite-payments'),
                'id'      => 're_scenario_b_discount',
                'default' => '3',
                'type'    => 'number',
                'custom_attributes' => array('step' => '0.1', 'min' => '0', 'max' => '50')
            ),
            array(
                'title'   => __('Checkout Label', 'reflection-elite-payments'),
                'desc'    => __('Label displayed on the checkout breakdown line item.', 'reflection-elite-payments'),
                'id'      => 're_scenario_b_label',
                'default' => 'Advance Booking Discount (3%)',
                'type'    => 'text'
            ),
            array('type' => 'sectionend', 'id' => 're_payments_section_b'),

            // SECTION: Scenario C
            array(
                'title' => __('Scenario C: Venetian Mirrors Category Override', 'reflection-elite-payments'),
                'type'  => 'title',
                'desc'  => __('Rules for bespoke handcrafted Venetian Mirrors: "Book Now" CTA, strictly no Cash on Delivery, and exclusive 50% advance / 100% full payment selection.', 'reflection-elite-payments'),
                'id'    => 're_payments_section_c'
            ),
            array(
                'title'   => __('Enable Scenario C', 'reflection-elite-payments'),
                'desc'    => __('Activate bespoke category overrides for Venetian Mirrors.', 'reflection-elite-payments'),
                'id'      => 're_scenario_c_enabled',
                'default' => 'yes',
                'type'    => 'checkbox'
            ),
            array(
                'title'   => __('Target Category Slug', 'reflection-elite-payments'),
                'desc'    => __('Category slug for Venetian Mirrors (default: <code>venetian-mirror</code>).', 'reflection-elite-payments'),
                'id'      => 're_scenario_c_category',
                'default' => 'venetian-mirror',
                'type'    => 'text'
            ),
            array(
                'title'   => __('Button Label Override', 'reflection-elite-payments'),
                'desc'    => __('Replaces "Add to Cart" / "Buy Now" on Venetian Mirrors with this label.', 'reflection-elite-payments'),
                'id'      => 're_scenario_c_button_text',
                'default' => 'Book Now',
                'type'    => 'text'
            ),
            array(
                'title'   => __('Disable Cash on Delivery (COD)', 'reflection-elite-payments'),
                'desc'    => __('Strictly disable COD whenever any Venetian Mirror product is in the cart.', 'reflection-elite-payments'),
                'id'      => 're_scenario_c_disable_cod',
                'default' => 'yes',
                'type'    => 'checkbox'
            ),
            array('type' => 'sectionend', 'id' => 're_payments_section_c')
        );
    }

    public static function render_settings_tab() {
        woocommerce_admin_fields(self::get_settings());
    }

    public static function save_settings() {
        woocommerce_update_options(self::get_settings());
    }

    public static function is_feature_active() {
        $sandbox = get_option('re_sandbox_mode', 'no');
        if ('yes' === $sandbox) {
            // Only active for admin users or test query param
            if (current_user_can('manage_woocommerce') || (isset($_GET['re_test_mode']) && '1' === $_GET['re_test_mode'])) {
                return true;
            }
            return false;
        }
        return true;
    }
}
