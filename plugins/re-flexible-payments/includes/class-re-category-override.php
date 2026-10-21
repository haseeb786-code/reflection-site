<?php
/**
 * Category-specific overrides for Venetian Mirrors (Scenario C)
 */

if (!defined('ABSPATH')) {
    exit;
}

class RE_Category_Override {

    public static function init() {
        // Change single product Add to Cart button text
        add_filter('woocommerce_product_single_add_to_cart_text', array(__CLASS__, 'override_button_text'), 20, 2);
        // Change shop/archive page Add to Cart button text
        add_filter('woocommerce_product_add_to_cart_text', array(__CLASS__, 'override_button_text'), 20, 2);
    }

    /**
     * Check if a product belongs to the configured Venetian category
     */
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

    /**
     * Check if current cart has any Venetian product
     */
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

    /**
     * Replace Add to Cart text with "Book Now" for Venetian Mirrors
     */
    public static function override_button_text($text, $product) {
        if (!$product) {
            return $text;
        }

        $product_id = $product->get_id();
        if (self::is_venetian_product($product_id)) {
            $custom_btn = get_option('re_scenario_c_button_text', 'Book Now');
            return !empty($custom_btn) ? esc_html($custom_btn) : __('Book Now', 'reflection-elite-payments');
        }

        return $text;
    }
}
