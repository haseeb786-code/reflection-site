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
