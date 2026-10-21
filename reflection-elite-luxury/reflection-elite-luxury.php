<?php
/**
 * Plugin Name: Reflection Elite — Italian Luxury Mirror Experience
 * Plugin URI: https://reflectionelite.com
 * Description: Dark & Gold luxury aesthetic, editorial typography, glassmorphism cards, and WhatsApp integration for Reflection Elite.
 * Version: 1.0.0
 * Author: Antigravity
 */

if (!defined('ABSPATH')) exit;

// 1. Enqueue Luxury Fonts & Global Dark Styling
add_action('wp_enqueue_scripts', function() {
    // Google Fonts: Playfair Display + Montserrat
    wp_enqueue_style('re-luxury-fonts', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,400&display=swap', array(), null);
}, 20);

// 2. Inject Comprehensive Luxury CSS into wp_head
add_action('wp_head', function() {
    ?>
    <style id="re-dark-luxury-theme">
        :root {
            --re-bg-main: #090c12;
            --re-bg-card: #121722;
            --re-bg-card-hover: #171e2c;
            --re-gold: #d4af37;
            --re-gold-light: #f3e5ab;
            --re-gold-dark: #aa820a;
            --re-text-main: #f1f5f9;
            --re-text-muted: #94a3b8;
            --re-border-gold: rgba(212, 175, 55, 0.25);
            --re-border-subtle: rgba(255, 255, 255, 0.08);
        }

        /* Global Body & Backgrounds */
        body, 
        .site, 
        .site-content,
        .ast-container,
        #content,
        .main-header-bar,
        .ast-theme-transparent-header,
        .ast-desktop .main-header-menu {
            background-color: var(--re-bg-main) !important;
            color: var(--re-text-main) !important;
            font-family: 'Montserrat', -apple-system, sans-serif !important;
        }

        /* Headings */
        h1, h2, h3, h4, h5, h6,
        .entry-title,
        .woocommerce-loop-product__title,
        .product_title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: #ffffff !important;
            letter-spacing: 0.5px;
        }

        /* Header & Navigation */
        .site-header,
        .main-header-bar {
            border-bottom: 1px solid var(--re-border-gold) !important;
            background: rgba(9, 12, 18, 0.95) !important;
            backdrop-filter: blur(10px);
        }

        .main-header-menu a,
        .ast-builder-menu a {
            color: #e2e8f0 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: color 0.2s ease;
        }

        .main-header-menu a:hover,
        .current-menu-item > a {
            color: var(--re-gold) !important;
        }

        /* WooCommerce Shop & Product Cards */
        ul.products li.product,
        .woocommerce ul.products li.product {
            background: var(--re-bg-card) !important;
            border: 1px solid var(--re-border-gold) !important;
            border-radius: 12px !important;
            padding: 16px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
            text-align: center;
            overflow: hidden;
        }

        ul.products li.product:hover,
        .woocommerce ul.products li.product:hover {
            transform: translateY(-6px) !important;
            border-color: var(--re-gold) !important;
            box-shadow: 0 12px 30px rgba(212, 175, 55, 0.2) !important;
            background: var(--re-bg-card-hover) !important;
        }

        ul.products li.product img {
            border-radius: 8px;
            transition: transform 0.4s ease;
            background: #0f141f;
        }

        ul.products li.product:hover img {
            transform: scale(1.04);
        }

        ul.products li.product .woocommerce-loop-product__title {
            font-size: 18px !important;
            margin-top: 14px !important;
            margin-bottom: 8px !important;
            color: #ffffff !important;
        }

        /* Price Highlights */
        .woocommerce ul.products li.product .price,
        .woocommerce div.product p.price,
        .woocommerce div.product span.price,
        .price {
            color: var(--re-gold) !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            font-family: 'Montserrat', sans-serif !important;
        }

        .price del {
            color: #64748b !important;
            font-weight: 400 !important;
            font-size: 14px !important;
        }

        .price ins {
            text-decoration: none !important;
        }

        /* Buttons (Add to Cart, Checkout, Place Order) */
        .woocommerce ul.products li.product .button,
        .woocommerce #respond input#submit, 
        .woocommerce a.button, 
        .woocommerce button.button, 
        .woocommerce input.button,
        .single_add_to_cart_button {
            background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%) !important;
            color: #000000 !important;
            font-weight: 700 !important;
            font-size: 13px !important;
            letter-spacing: 1px !important;
            text-transform: uppercase !important;
            padding: 12px 22px !important;
            border-radius: 6px !important;
            border: none !important;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25) !important;
            transition: all 0.2s ease !important;
        }

        .woocommerce ul.products li.product .button:hover,
        .woocommerce a.button:hover, 
        .woocommerce button.button:hover, 
        .woocommerce input.button:hover,
        .single_add_to_cart_button:hover {
            background: linear-gradient(135deg, #f3e5ab 0%, #d4af37 100%) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(212, 175, 55, 0.4) !important;
        }

        /* Single Product Page Styling */
        .woocommerce div.product {
            background: transparent !important;
        }

        .woocommerce div.product div.images img {
            border: 1px solid var(--re-border-gold);
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .woocommerce-product-details__short-description {
            color: var(--re-text-muted) !important;
            line-height: 1.8;
            font-size: 15px;
        }

        .woocommerce-tabs ul.tabs {
            background: transparent !important;
            border-bottom: 1px solid var(--re-border-gold) !important;
        }

        .woocommerce-tabs ul.tabs li {
            background: var(--re-bg-card) !important;
            border: 1px solid var(--re-border-subtle) !important;
            border-radius: 6px 6px 0 0 !important;
        }

        .woocommerce-tabs ul.tabs li.active {
            background: var(--re-bg-card-hover) !important;
            border-color: var(--re-gold) !important;
        }

        .woocommerce-tabs ul.tabs li a {
            color: #ffffff !important;
        }

        .woocommerce-tabs .panel {
            background: var(--re-bg-card) !important;
            border: 1px solid var(--re-border-subtle) !important;
            border-top: none !important;
            padding: 24px !important;
            border-radius: 0 0 8px 8px !important;
            color: var(--re-text-muted) !important;
        }

        /* Cart & Checkout Pages */
        .woocommerce-cart table.cart,
        .woocommerce-checkout #order_review,
        .woocommerce-checkout .woocommerce-billing-fields,
        .woocommerce-checkout .woocommerce-shipping-fields {
            background: var(--re-bg-card) !important;
            border: 1px solid var(--re-border-gold) !important;
            border-radius: 10px !important;
            padding: 24px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
        }

        .woocommerce table.shop_table {
            border: 1px solid var(--re-border-subtle) !important;
            color: var(--re-text-main) !important;
        }

        .woocommerce table.shop_table th {
            color: var(--re-gold) !important;
            border-bottom: 1px solid var(--re-border-gold) !important;
        }

        .woocommerce table.shop_table td {
            border-top: 1px solid var(--re-border-subtle) !important;
        }

        /* Input Fields on Dark */
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="password"],
        textarea,
        select,
        .select2-container--default .select2-selection--single {
            background-color: #1a2232 !important;
            border: 1px solid #334155 !important;
            color: #ffffff !important;
            border-radius: 6px !important;
            padding: 10px 14px !important;
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="tel"]:focus,
        textarea:focus,
        select:focus {
            border-color: var(--re-gold) !important;
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.25) !important;
        }

        /* Payment Gateway Box on Checkout */
        #payment {
            background: #0f141f !important;
            border: 1px solid var(--re-border-gold) !important;
            border-radius: 8px !important;
        }

        #payment ul.payment_methods {
            border-bottom: 1px solid var(--re-border-subtle) !important;
        }

        #payment div.payment_box {
            background: #171f2e !important;
            color: #cbd5e1 !important;
            border: 1px solid var(--re-border-subtle) !important;
        }

        #payment div.payment_box::before {
            border-bottom-color: #171f2e !important;
        }

        /* Footer */
        .site-footer {
            background-color: #06080c !important;
            border-top: 1px solid var(--re-border-gold) !important;
            color: #64748b !important;
        }

        /* Floating WhatsApp Button Animation */
        #re-floating-whatsapp {
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: #ffffff;
            border-radius: 50px;
            padding: 12px 22px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            font-size: 14px;
            text-decoration: none;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
            z-index: 999999;
            border: 1px solid rgba(255,255,255,0.4);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        #re-floating-whatsapp:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
            color: #ffffff;
        }
    </style>
    <?php
});

// 3. Add 50% Advance Notice on Single Product Page right under price
add_action('woocommerce_single_product_summary', function() {
    global $product;
    if (!$product) return;
    $price = $product->get_price();
    if ($price > 0) {
        $advance = number_format($price / 2, 2);
        echo '<div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 6px; padding: 10px 14px; margin: 15px 0; display: flex; align-items: center; gap: 10px;">';
        echo '<span style="font-size: 18px;">✨</span>';
        echo '<span style="font-size: 13px; color: #f3e5ab; font-weight: 500;"><strong>50% Advance Policy:</strong> Pay only <strong>₹' . $advance . '</strong> now via Razorpay/WhatsApp to start production. Remaining 50% upon delivery.</span>';
        echo '</div>';
    }
}, 15);

// 4. Inject Site-wide Floating WhatsApp Button
add_action('wp_footer', function() {
    ?>
    <a href="https://wa.me/917387463103?text=Hi%2C%20I%20have%20a%20question%20about%20Reflection%20Elite%20luxury%20mirrors." target="_blank" id="re-floating-whatsapp">
        <span style="font-size: 20px;">💬</span>
        <span>Chat on WhatsApp</span>
    </a>
    <?php
});
