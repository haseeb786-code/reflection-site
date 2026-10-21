<?php
/**
 * Deposit & Balance Due Lifecycle Manager (Scenario B)
 */

if (!defined('ABSPATH')) {
    exit;
}

class RE_Deposit_Manager {

    public static function init() {
        // Intercept order creation to save deposit metadata
        add_action('woocommerce_checkout_create_order', array(__CLASS__, 'save_deposit_order_meta'), 20, 2);

        // Transition order status to "deposit-paid" upon successful initial Razorpay payment
        add_action('woocommerce_payment_complete', array(__CLASS__, 'handle_deposit_payment_complete'), 20, 1);
        add_action('woocommerce_order_status_processing', array(__CLASS__, 'maybe_set_deposit_paid_status'), 20, 1);

        // Add Balance Due notice to Customer Thank You page
        add_action('woocommerce_thankyou', array(__CLASS__, 'render_thankyou_balance_box'), 15, 1);

        // Add Balance Due details to Customer Emails
        add_action('woocommerce_email_after_order_table', array(__CLASS__, 'render_email_balance_box'), 15, 4);

        // Admin Metabox for Balance Due Link & WhatsApp Quick-Action
        add_action('add_meta_boxes', array(__CLASS__, 'add_admin_balance_metabox'));
    }

    /**
     * Save deposit & balance calculations to order meta
     */
    public static function save_deposit_order_meta($order, $data) {
        $plan = WC()->session ? WC()->session->get('re_payment_plan', 'full') : 'full';
        
        if ('deposit' === $plan) {
            $deposit_paid = WC()->session ? floatval(WC()->session->get('re_calculated_deposit_paid', 0)) : 0;
            $remaining    = WC()->session ? floatval(WC()->session->get('re_calculated_remaining_balance', 0)) : 0;

            $order->update_meta_data('_re_is_deposit', 'yes');
            $order->update_meta_data('_re_deposit_amount_paid', $deposit_paid);
            $order->update_meta_data('_re_remaining_balance', $remaining);
            $order->update_meta_data('_re_balance_status', 'pending');
        }
    }

    /**
     * When Razorpay completes initial deposit, switch status to "Deposit Paid — Balance Due"
     */
    public static function handle_deposit_payment_complete($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }

        if ('yes' === $order->get_meta('_re_is_deposit') && 'pending' === $order->get_meta('_re_balance_status')) {
            // Ensure child balance order / follow-up link is generated
            self::ensure_balance_order_created($order);

            // Set custom order status
            $order->update_status('deposit-paid', __('50% Advance deposit captured via Razorpay. Order placed in "Deposit Paid — Balance Due" awaiting final clearance.', 'reflection-elite-payments'));
        }
    }

    /**
     * Fallback for gateways that transition directly to processing
     */
    public static function maybe_set_deposit_paid_status($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }

        if ('yes' === $order->get_meta('_re_is_deposit') && 'pending' === $order->get_meta('_re_balance_status')) {
            self::ensure_balance_order_created($order);
            
            // Remove processing hook temporarily to avoid infinite loop
            remove_action('woocommerce_order_status_processing', array(__CLASS__, 'maybe_set_deposit_paid_status'), 20);
            $order->update_status('deposit-paid', __('50% Advance deposit captured. Order placed in "Deposit Paid — Balance Due".', 'reflection-elite-payments'));
            add_action('woocommerce_order_status_processing', array(__CLASS__, 'maybe_set_deposit_paid_status'), 20);
        }
    }

    /**
     * Generate secondary child order for the remaining 50% balance
     */
    public static function ensure_balance_order_created($parent_order) {
        $existing_child_id = $parent_order->get_meta('_re_balance_child_order_id');
        if (!empty($existing_child_id) && wc_get_order($existing_child_id)) {
            return;
        }

        $remaining_amount = floatval($parent_order->get_meta('_re_remaining_balance'));
        if ($remaining_amount <= 0) {
            return;
        }

        try {
            $child_order = wc_create_order(array(
                'customer_id'   => $parent_order->get_customer_id(),
                'parent'        => $parent_order->get_id(),
                'status'        => 'pending',
                'customer_note' => sprintf(__('Remaining 50%% Balance Payment for Order #%s', 'reflection-elite-payments'), $parent_order->get_order_number())
            ));

            // Copy billing and shipping
            $child_order->set_address($parent_order->get_address('billing'), 'billing');
            $child_order->set_address($parent_order->get_address('shipping'), 'shipping');

            // Add custom fee line item for the balance
            $item = new WC_Order_Item_Fee();
            $item->set_name(sprintf(__('Remaining 50%% Balance Due (Order #%s)', 'reflection-elite-payments'), $parent_order->get_order_number()));
            $item->set_amount($remaining_amount);
            $item->set_total($remaining_amount);
            $child_order->add_item($item);

            $child_order->set_currency($parent_order->get_currency());
            $child_order->calculate_totals();
            $child_order->update_meta_data('_re_is_balance_order', 'yes');
            $child_order->update_meta_data('_re_parent_order_id', $parent_order->get_id());
            $child_order->save();

            // Generate the secure native payment URL
            $pay_url = $child_order->get_checkout_payment_url(true);

            // Save to parent order
            $parent_order->update_meta_data('_re_balance_child_order_id', $child_order->get_id());
            $parent_order->update_meta_data('_re_balance_payment_url', $pay_url);
            $parent_order->save();

        } catch (Exception $e) {
            error_log('[Reflection Elite Payments] Error generating balance order: ' . $e->getMessage());
        }
    }

    /**
     * Display Balance Due on Thank You page
     */
    public static function render_thankyou_balance_box($order_id) {
        $order = wc_get_order($order_id);
        if (!$order || 'yes' !== $order->get_meta('_re_is_deposit')) {
            return;
        }

        $balance = floatval($order->get_meta('_re_remaining_balance'));
        $pay_url = $order->get_meta('_re_balance_payment_url');

        echo '<div style="background:#111726; border:1px solid rgba(212,175,55,0.4); border-radius:10px; padding:22px; margin:24px 0; color:#e2e8f0; box-shadow:0 10px 30px rgba(0,0,0,0.6);">';
        echo '<h3 style="font-family:\'Cinzel\',serif; color:#f5e7a9; margin:0 0 10px 0; font-size:18px;">👑 Handcrafted Advance Deposit Confirmed</h3>';
        echo '<p style="margin:0 0 14px 0; font-size:14px; line-height:1.6;">Thank you for your order! Your <strong>50% advance deposit</strong> has been received, and our artisans in Goa have commenced precision cutting and hand-beveling for your luxury mirror.</p>';
        echo '<div style="background:#090d15; padding:14px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); margin-bottom:16px;">';
        echo '<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>Initial Deposit Paid:</span> <strong style="color:#22c55e;">' . wc_price($order->get_total()) . '</strong></div>';
        echo '<div style="display:flex; justify-content:space-between;"><span>Remaining Balance Due:</span> <strong style="color:#f5e7a9;">' . wc_price($balance) . '</strong></div>';
        echo '</div>';
        if (!empty($pay_url)) {
            echo '<p style="font-size:13px; color:#94a3b8; margin:0 0 10px 0;">You can clear your remaining balance prior to crated dispatch using your secure payment link below (also emailed to you):</p>';
            echo '<a href="' . esc_url($pay_url) . '" style="background:linear-gradient(135deg, #f5d77f, #d4af37); color:#07090d; font-family:\'Cinzel\',serif; font-weight:bold; font-size:13px; padding:10px 20px; border-radius:6px; text-decoration:none; display:inline-block; margin-top:4px;">Pay Remaining 50% Balance (Razorpay) →</a>';
        }
        echo '</div>';
    }

    /**
     * Attach Balance Due info to Customer Invoice Email
     */
    public static function render_email_balance_box($order, $sent_to_admin, $plain_text, $email) {
        if (!$order || 'yes' !== $order->get_meta('_re_is_deposit')) {
            return;
        }

        $balance = floatval($order->get_meta('_re_remaining_balance'));
        $pay_url = $order->get_meta('_re_balance_payment_url');

        if ($plain_text) {
            echo "\n----------------------------------------\n";
            echo "DEPOSIT PAID — BALANCE DUE INFORMATION\n";
            echo "Initial 50% Deposit: " . wc_price($order->get_total()) . "\n";
            echo "Remaining Balance Due: " . wc_price($balance) . "\n";
            if (!empty($pay_url)) {
                echo "Secure Balance Payment Link: " . $pay_url . "\n";
            }
            echo "----------------------------------------\n\n";
        } else {
            echo '<div style="background:#141b2b; border:1px solid #d4af37; padding:18px; border-radius:8px; margin:20px 0; color:#e2e8f0;">';
            echo '<h4 style="color:#f5e7a9; margin:0 0 8px 0; font-size:16px;">Deposit Paid — Balance Due Notice</h4>';
            echo '<p style="font-size:13px; margin:0 0 10px 0;">Initial 50% deposit received. Remaining balance of <strong>' . wc_price($balance) . '</strong> is due prior to final reinforced wooden crated dispatch.</p>';
            if (!empty($pay_url)) {
                echo '<p><a href="' . esc_url($pay_url) . '" style="background:#d4af37; color:#000000; font-weight:bold; padding:8px 16px; border-radius:4px; text-decoration:none; display:inline-block;">Pay Remaining 50% Balance Now →</a></p>';
            }
            echo '</div>';
        }
    }

    /**
     * Admin Order Detail Metabox for WhatsApp Follow-up & Link Copying
     */
    public static function add_admin_balance_metabox() {
        add_meta_box(
            're_balance_due_metabox',
            __('Reflection Elite — 50% Deposit & Balance Due Controls', 'reflection-elite-payments'),
            array(__CLASS__, 'render_admin_balance_metabox'),
            'shop_order',
            'side',
            'high'
        );
    }

    public static function render_admin_balance_metabox($post) {
        $order = wc_get_order($post->ID);
        if (!$order || 'yes' !== $order->get_meta('_re_is_deposit')) {
            echo '<p style="color:#94a3b8; font-size:13px;">This order is a standard 100% full payment order.</p>';
            return;
        }

        $balance = floatval($order->get_meta('_re_remaining_balance'));
        $pay_url = $order->get_meta('_re_balance_payment_url');
        $phone   = $order->get_billing_phone();

        echo '<div style="font-size:13px; line-height:1.6;">';
        echo '<p style="margin:0 0 8px 0;"><strong>Remaining Balance:</strong> <span style="color:#d4af37; font-weight:bold;">' . wc_price($balance) . '</span></p>';
        
        if (!empty($pay_url)) {
            echo '<p style="margin:0 0 6px 0;"><strong>Customer Balance Payment Link:</strong></p>';
            echo '<input type="text" readonly value="' . esc_attr($pay_url) . '" style="width:100%; font-size:11px; margin-bottom:10px;" onclick="this.select();" />';
            
            if (!empty($phone)) {
                $clean_phone = preg_replace('/[^0-9]/', '', $phone);
                if (strlen($clean_phone) === 10) {
                    $clean_phone = '91' . $clean_phone;
                }
                $wa_msg = sprintf(
                    __("Hello %s, your bespoke luxury mirror from Reflection Elite is completing final polishing! Please use this link to clear your remaining 50%% balance of %s for crated dispatch: %s", 'reflection-elite-payments'),
                    $order->get_billing_first_name(),
                    wc_price($balance),
                    $pay_url
                );
                $wa_link = 'https://wa.me/' . $clean_phone . '?text=' . rawurlencode($wa_msg);
                echo '<a href="' . esc_url($wa_link) . '" target="_blank" class="button button-primary" style="background:#25D366; border-color:#25D366; width:100%; text-align:center; margin-top:6px;">📲 Send WhatsApp Balance Link</a>';
            }
        }
        echo '</div>';
    }
}
