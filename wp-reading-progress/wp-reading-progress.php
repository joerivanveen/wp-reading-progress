<?php
/*
Plugin Name: WP Reading Progress
Plugin URI: https://github.com/joerivanveen/wp-reading-progress
Description: Light weight customizable reading progress bar. Great UX on longreads! Customize under Settings -> WP Reading Progress
Version: 1.2.1
Author: Ruige hond
Author URI: https://ruigehond.nl
License: GPLv3
Text Domain: wp-reading-progress
Domain Path: /languages/
*/
defined('ABSPATH') or die();
// This is plugin nr. 6 by Ruige hond. It identifies as: ruigehond006.
Define('RUIGEHOND006_VERSION', '1.2.1');
// Register hooks for plugin management, functions are at the bottom of this file.
register_activation_hook(__FILE__, 'ruigehond006_install');
register_deactivation_hook(__FILE__, 'ruigehond006_deactivate');
register_uninstall_hook(__FILE__, 'ruigehond006_uninstall');
// Startup the plugin
add_action('init', 'ruigehond006_run');
add_action('wp', 'ruigehond006_localize');
/**
 * the actual plugin on the frontend
 */
function ruigehond006_run()
{
    if (is_admin()) {
        load_plugin_textdomain('wp-reading-progress', null, dirname(plugin_basename(__FILE__)) . '/languages/');
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');
        wp_enqueue_script('ruigehond006_admin_javascript', plugin_dir_url(__FILE__) . 'admin.js', 'wp-color-picker', RUIGEHOND006_VERSION, true);
        add_action('admin_init', 'ruigehond006_settings');
        add_action('admin_menu', 'ruigehond006_menuitem');
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'ruigehond006_settingslink'); // settings link on plugins page
    } else {
        wp_enqueue_script('ruigehond006_javascript', plugin_dir_url(__FILE__) . 'wp-reading-progress.js', 'jQuery', RUIGEHOND006_VERSION);
        wp_enqueue_style('ruigehond006_stylesheet', plugin_dir_url(__FILE__) . 'wp-reading-progress.css', false, RUIGEHOND006_VERSION);
    }
}

function ruigehond006_localize()
{
    if (!is_admin()) {
        $post_identifier = false;
        // check if we're using the progress bar here
        $option = get_option('ruigehond006');
        $post_type = get_post_type();
        $post_types = array('post');
        if (isset($option['post_types'])) {
            $post_types = array_merge($option['post_types'], $post_types);
        }
        if (in_array($post_type, $post_types)) {
            if (is_singular()) {
                if (!isset($option['include_comments'])) {
                    $post_identifier = '.' . implode(get_post_class(), '.');
                } else {
                    $post_identifier = 'body';
                }
            } else {
                if (isset($option['archives'])) {
                    $post_identifier = 'body';
                }
            }
        }
        if ($post_identifier !== false) {
            wp_localize_script('ruigehond006_javascript', 'ruigehond006_custom', array_merge(
                $option, array(
                    'post_identifier' => $post_identifier,
                )
            ));
        }
    }
}

/**
 * manage settings
 */
function ruigehond006_settings()
{
    /**
     * register a new setting, call this function for each setting
     * Arguments: (Array)
     * - group, the same as in settings_fields, for security / nonce etc.
     * - the name of the options
     * - the function that will validate the options, valid options are automatically saved by WP
     */
    register_setting('ruigehond006', 'ruigehond006', 'ruigehond006_settings_validate');
    // register a new section in the page
    add_settings_section(
        'progress_bar_settings', // section id
        __('Set your options', 'wp-reading-progress'), // title
        function () {
            echo '<p>' . __('This plugin displays a reading progress bar on your single blog post pages, using the blog article to calculate reading progress.', 'wp-reading-progress') .
                '<br/>' . __('Optionally you can place it on other pages as well. When it does not find a single article, it uses the whole page to calculate reading progress.', 'wp-reading-progress') .
                '<br/>' . __('Please use valid input or the bar might not display.', 'wp-reading-progress') .
                '</p>';
        }, //callback
        'ruigehond006' // page
    );
    $option = get_option('ruigehond006');
    if (!$option) {
        echo '<div class="notice notice-error is-dismissible"><p>';
        echo sprintf(__('No options found, please deactivate %s and then activate it again.', 'wp-reading-progress'), 'Each domain a page');
        echo '</p></div>';
    } else {
        add_settings_field(
            'ruigehond006_bar_attach', // As of WP 4.6 this value is used only internally
            // use $args' label_for to populate the id inside the callback
            __('Stick the bar to this element', 'wp-reading-progress'), // title
            function ($args) {
                echo '<input type="text" name="ruigehond006[bar_attach]" value="' . $args['option']['bar_attach'] . '"/>';
                echo '<div class="ruigehond006 explanation"><em>' . sprintf(__('Use %s or %s, or any VALID selector of a fixed element where the bar can be appended to, e.g. a sticky menu.', 'wp-reading-progress'),
                        '<a>top</a>', '<a>bottom</a>') . '</em></div>';
            }, // callback
            'ruigehond006', // page id
            'progress_bar_settings', // section id
            [
                'label_for' => '',
                'class' => 'ruigehond_row',
                'option' => $option,
            ] // args
        );
        add_settings_field(
            'ruigehond006_bar_color', // As of WP 4.6 this value is used only internally
            // use $args' label_for to populate the id inside the callback
            __('Color of the progress bar', 'wp-reading-progress'), // title
            function ($args) {
                echo '<input type="text" name="ruigehond006[bar_color]" value="' . $args['option']['bar_color'] . '"/>';
            }, // callback
            'ruigehond006', // page id
            'progress_bar_settings', // section id
            [
                'label_for' => '',
                'class' => 'ruigehond_row',
                'option' => $option,
            ] // args
        );
        add_settings_field(
            'ruigehond006_bar_height', // As of WP 4.6 this value is used only internally
            // use $args' label_for to populate the id inside the callback
            __('Progress bar thickness', 'wp-reading-progress'), // title
            function ($args) {
                echo '<input type="text" name="ruigehond006[bar_height]" value="' . $args['option']['bar_height'] . '"/>';
                echo '<div class="ruigehond006 explanation"><em>' . sprintf(__('Thickness based on screen height is recommended, e.g. %s. But you can also use pixels, e.g. %s.', 'wp-reading-progress'), '<a>.5vh</a>', '<a>6px</a>') . '</em></div>';
            }, // callback
            'ruigehond006', // page id
            'progress_bar_settings', // section id
            [
                'label_for' => '',
                'class' => 'ruigehond_row',
                'option' => $option,
            ] // args
        );
        add_settings_field(
            'ruigehond006_mark_it_zero',
            __('Make bar start at 0%', 'wp-reading-progress'),
            function ($args) {
                echo '<label><input type="checkbox" name="ruigehond006[mark_it_zero]" value="Yes"';
                if (isset($args['option']['mark_it_zero']) && $args['option']['mark_it_zero']) {
                    echo ' checked="checked"';
                }
                echo '/> ' . __('Yes', 'wp-reading-progress') . '</label>';
            },
            'ruigehond006',
            'progress_bar_settings',
            [
                'label_for' => '',
                'class' => 'ruigehond_row',
                'option' => $option,
            ]
        );
        add_settings_field(
            'ruigehond006_include_comments',
            __('On single post page', 'wp-reading-progress'),
            function ($args) {
                echo '<label><input type="checkbox" name="ruigehond006[include_comments]"';
                if (isset($args['option']['include_comments']) && $args['option']['include_comments']) {
                    echo ' checked="checked"';
                }
                echo '/> ' . __('use whole page to calculate reading progress', 'wp-reading-progress') . '</label>';
            },
            'ruigehond006',
            'progress_bar_settings',
            [
                'label_for' => '',
                'class' => 'ruigehond_row',
                'option' => $option,
            ]
        );
        add_settings_field(
            'ruigehond006_post_types',
            __('Show reading progress on these (custom) post types as well', 'wp-reading-progress'),
            function ($args) {
                $post_types = [];
                if (isset($args['option']['post_types'])) {
                    $post_types = $args['option']['post_types'];
                }
                foreach (get_post_types(Array('public' => true)) as $post_type) {
                    if ($post_type !== 'post') {
                        echo '<label><input type="checkbox" name="ruigehond006[post_types][]" value="' . $post_type . '"';
                        if (in_array($post_type, $post_types)) {
                            echo ' checked="checked"';
                        }
                        echo '/> ' . $post_type . '</label><br/>';
                    }
                }
            },
            'ruigehond006',
            'progress_bar_settings',
            [
                'label_for' => '',
                'class' => 'ruigehond_row',
                'option' => $option,
            ]
        );
        add_settings_field(
            'ruigehond006_archives',
            __('And on their archives', 'wp-reading-progress'),
            function ($args) {
                echo '<input type="checkbox" name="ruigehond006[archives]"';
                if (isset($args['option']['archives']) && $args['option']['archives']) {
                    echo ' checked="checked"';
                }
                echo '/>';
            },
            'ruigehond006',
            'progress_bar_settings',
            [
                'label_for' => '',
                'class' => 'ruigehond_row',
                'option' => $option,
            ]
        );
    }
}

function ruigehond006_settingspage()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    echo '<div class="wrap"><h1>' . esc_html(get_admin_page_title()) . '</h1><form action="options.php" method="post">';
    // output security fields for the registered setting
    settings_fields('ruigehond006');
    // output setting sections and their fields
    do_settings_sections('ruigehond006');
    // output save settings button
    submit_button(__('Save Settings', 'wp-reading-progress'));
    echo '</form></div>';
}

function ruigehond006_settingslink($links) {
    $url = get_admin_url() . 'options-general.php?page=wp-reading-progress';
    $settings_link = '<a href="' . $url . '">' . __('Settings', 'wp-reading-progress') . '</a>';
    array_unshift($links, $settings_link);

    return $links;
}

function ruigehond006_menuitem()
{
    add_options_page(
        'WP Reading Progress',
        'WP Reading Progress',
        'manage_options',
        'wp-reading-progress',
        'ruigehond006_settingspage'
    );
}

/**
 * plugin management functions
 */
function ruigehond006_install()
{
    if (!get_option('ruigehond006')) { // insert default settings:
        add_option('ruigehond006', array(
            'bar_attach' => 'top',
            'bar_color' => '#f1592a',
            'bar_height' => '.5vh',
        ), null, true);
    }
}

function ruigehond006_deactivate()
{
    // nothing to do really
}

function ruigehond006_uninstall()
{
    // remove settings
    delete_option('ruigehond006');
}