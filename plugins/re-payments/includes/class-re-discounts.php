<?php
/**
 * Dynamic Discounts & Fee Engine (Scenarios A & B)
 */

if (!defined('ABSPATH')) {
    exit;
}

class RE_Discounts {

    public static function init() {
        add_action('woocommerce_cart_calculate_fees', array(__CLASS__, 'apply_payment_scenarios_discounts'), 20, 1);
    }

    /**
     * Calculate and apply discounts and deposit fee deductions
     */
    public static function apply_payment_scenarios_discounts($cart) {
        if (is_admin() && !defined('DOING_AJAX')) {
            return;
        }

        if (!RE_Admin_Settings::is_feature_active()) {
            return;
        }

        // Selected payment gateway check: If COD is explicitly chosen, no payment discounts apply
        $chosen_gateway = WC()->session ? WC()->session->get('chosen_payment_method') : '';
        if ('cod' === $chosen_gateway) {
            return;
        }

        // Get selected plan ('full' or 'deposit')
        $plan = WC()->session ? WC()->session->get('re_payment_plan', 'full') : 'full';

        // Check if coupons are present and examine stacking policy
        $coupons = $cart->get_coupons();
        $stacking_mode = get_option('re_coupon_stacking_mode', 'net');

        if (!empty($coupons) && 'exclusive' === $stacking_mode) {
            // Promo coupons present and stacking is set to exclusive -> no discount
            return;
        }

        // Calculate base amount for discount
        // Subtotal after coupon discounts = Net Subtotal
        $subtotal = $cart->get_subtotal();
        $discount_total = $cart->get_discount_total();
        $net_subtotal = max(0, $subtotal - $discount_total);

        if ($net_subtotal <= 0) {
            return;
        }

        // -------------------------------------------------------------
        // SCENARIO A: FULL PAYMENT DISCOUNT
        // -------------------------------------------------------------
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

        // -------------------------------------------------------------
        // SCENARIO B: PARTIAL PAYMENT (50% ADVANCE DEPOSIT)
        // -------------------------------------------------------------
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

                // Calculate discounted order total
                $discounted_order_value = max(0, $net_subtotal - $discount_amount);
                
                // Add any shipping costs into the deposit basis
                $shipping_total = $cart->get_shipping_total();
                $grand_total_estimate = $discounted_order_value + $shipping_total;

                // Calculate the remaining balance to defer
                $deposit_fraction = $deposit_pct / 100;
                $immediate_deposit_due = round($grand_total_estimate * $deposit_fraction, 2);
                $remaining_balance = round($grand_total_estimate - $immediate_deposit_due, 2);

                if ($remaining_balance > 0) {
                    $balance_label = sprintf(__('Remaining Balance Due Prior to Dispatch (%d%%)', 'reflection-elite-payments'), (100 - $deposit_pct));
                    $cart->add_fee($balance_label, -$remaining_balance, false);

                    // Store calculated balance in session for order creation
                    WC()->session->set('re_calculated_remaining_balance', $remaining_balance);
                    WC()->session->set('re_calculated_deposit_paid', $immediate_deposit_due);
                }
            }
        }
    }
}
