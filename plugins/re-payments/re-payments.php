<?php
/**
 * Plugin Name: Reflection Elite - Flexible Payment & Discount Engine
 * Description: Enterprise-grade toggleable payment scenarios (Full Payment Discount, Partial Deposit, and Venetian Mirrors Category Override) with admin settings panel.
 * Version: 1.0.0
 * Author: Reflection Elite Atelier
 * Text Domain: reflection-elite-payments
 */

if (!defined('ABSPATH')) {
    exit;
}

define('RE_PAYMENTS_VERSION', '1.0.0');
define('RE_PAYMENTS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RE_PAYMENTS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load Classes
require_once RE_PAYMENTS_PLUGIN_DIR . 'includes/class-re-admin-settings.php';
require_once RE_PAYMENTS_PLUGIN_DIR . 'includes/class-re-category-override.php';
require_once RE_PAYMENTS_PLUGIN_DIR . 'includes/class-re-checkout-overrides.php';
require_once RE_PAYMENTS_PLUGIN_DIR . 'includes/class-re-discounts.php';
require_once RE_PAYMENTS_PLUGIN_DIR . 'includes/class-re-deposit-manager.php';

class Reflection_Elite_Payments {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Initialize custom order status
        add_action('init', array($this, 'register_deposit_order_status'));
        add_filter('wc_order_statuses', array($this, 'add_deposit_order_status_to_list'));

        // Initialize sub-modules
        RE_Admin_Settings::init();
        RE_Category_Override::init();
        RE_Checkout_Overrides::init();
        RE_Discounts::init();
        RE_Deposit_Manager::init();
    }

    /**
     * Register Custom Order Status: "Deposit Paid — Balance Due"
     */
    public function register_deposit_order_status() {
        register_post_status('wc-deposit-paid', array(
            'label'                     => _x('Deposit Paid — Balance Due', 'Order status', 'reflection-elite-payments'),
            'public'                    => true,
            'exclude_from_search'       => false,
            'show_in_admin_all_list'    => true,
            'show_in_admin_status_list' => true,
            'label_count'               => _n_noop('Deposit Paid <span class="count">(%s)</span>', 'Deposit Paid <span class="count">(%s)</span>', 'reflection-elite-payments')
        ));
    }

    public function add_deposit_order_status_to_list($order_statuses) {
        $new_statuses = array();
        foreach ($order_statuses as $key => $status) {
            $new_statuses[$key] = $status;
            if ('wc-processing' === $key) {
                $new_statuses['wc-deposit-paid'] = _x('Deposit Paid — Balance Due', 'Order status', 'reflection-elite-payments');
            }
        }
        if (!isset($new_statuses['wc-deposit-paid'])) {
            $new_statuses['wc-deposit-paid'] = _x('Deposit Paid — Balance Due', 'Order status', 'reflection-elite-payments');
        }
        return $new_statuses;
    }
}

add_action('plugins_loaded', array('Reflection_Elite_Payments', 'get_instance'));
