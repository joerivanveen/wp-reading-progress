<?php
/*
Plugin Name: WP Reading Progress
Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
Description: Light weight customizable reading progress bar. Great UX on longreads.
Version: 0.0.1
Author: Ruige hond
Author URI: https://ruigehond.nl
License: GPL2
*/

defined( 'ABSPATH' ) or die();
// This is plugin nr. 6 by Ruige hond. It identifies as: ruigehond006.

// Register hooks for plugin management, functions are at the bottom of this file.
register_activation_hook( __FILE__, 'ruigehond006_install' );
register_deactivation_hook( __FILE__, 'ruigehond006_deactivate' );
register_uninstall_hook( __FILE__, 'ruigehond006_uninstall' );

// Startup the plugin
add_action( 'init', 'ruigehond006_run' );

function ruigehond006_run() {
    if (! is_admin() ) {
        load_plugin_textdomain('ruigehond', false, dirname(plugin_basename(__FILE__)) . '/languages/');
        wp_enqueue_script('ruigehond006_javascript', plugin_dir_url(__FILE__) . 'wp-reading-progress.0.0.1.js', 'jQuery');
        wp_enqueue_style('ruigehond006_stylesheet', plugin_dir_url(__FILE__) . 'wp-reading-progress.0.0.1.css');
    }
}
function ruigehond006_install() {
    // default settings
}
function ruigehond006_deactivate() {
    // do nothing
}
function ruigehond006_uninstall() {
    // remove settings
}