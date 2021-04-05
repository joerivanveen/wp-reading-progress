<?php
/*
Plugin Name: WP Reading Progress
Plugin URI: https://github.com/joerivanveen/wp-reading-progress
Description: Light weight customizable reading progress bar. Great UX on longreads! Customize under Settings -> WP Reading Progress
Version: 1.3.6
Author: Ruige hond
Author URI: https://ruigehond.nl
License: GPLv3
Text Domain: wp-reading-progress
Domain Path: /languages/
*/
defined('ABSPATH') or die();
// This is plugin nr. 6 by Ruige hond. It identifies as: ruigehond006.
Define('RUIGEHOND006_VERSION', '1.3.6');
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
    // temporarily add 'post' post_type only when updating from before 1.2.4
    // TODO remove this code when everyone is beyond 1.2.4
    if (false === get_option('ruigehond006_upgraded_1.2.4')) {
        if (false !== ($option = get_option('ruigehond006'))) {
            if (isset($option['post_types'])) {
                $option['post_types'][] = 'post';
            } else {
                $option['post_types'] = array('post');
            }
            update_option('ruigehond006', $option);
            unset($option);
            add_option('ruigehond006_upgraded_1.2.4', 'yes', '', 'yes');
        }
    }// end upgrade 1.2.4
    if (is_admin()) {
        load_plugin_textdomain('wp-reading-progress', null, dirname(plugin_basename(__FILE__)) . '/languages/');
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');
        wp_enqueue_script('ruigehond006_admin_javascript', plugin_dir_url(__FILE__) . 'admin.js', 'wp-color-picker', RUIGEHOND006_VERSION, true);
        add_action('admin_init', 'ruigehond006_settings');
        add_action('admin_menu', 'ruigehond006_menuitem');
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'ruigehond006_settingslink'); // settings link on plugins page
        add_action('add_meta_boxes', 'ruigehond006_meta_box_add'); // in the box the user can activate the bar for a single post
        add_action('save_post', 'ruigehond006_meta_box_save');
    } else {
        wp_enqueue_script('ruigehond006_javascript', plugin_dir_url(__FILE__) . 'wp-reading-progress.min.js', false, RUIGEHOND006_VERSION);
    }
}

function ruigehond006_localize()
{
    if (!is_admin()) {
        $post_identifier = null;
        // check if we're using the progress bar here
        $option = get_option('ruigehond006');
        $post_id = get_the_ID();
        if (is_singular()) {
            if ((isset($option['post_types']) && in_array(get_post_type($post_id), $option['post_types']))
                or 'yes' === get_post_meta($post_id, '_ruigehond006_show', true)) {
                if (isset($option['include_comments'])) {
                    $post_identifier = 'body';
                } else {
                    $post_identifier = '.' . implode('.', get_post_class('', $post_id));
                }
            }
        } elseif (isset($option['archives']) && isset($option['post_types']) && in_array(get_post_type(), $option['post_types'])) {
            $post_identifier = 'body';
        }
        if (null !== $post_identifier) {
            wp_localize_script('ruigehond006_javascript', 'ruigehond006_c', array_merge(
                $option, array(
                    'post_identifier' => $post_identifier,
                    'post_id' => $post_id,
                )
            ));
        }
        if (!isset($option['no_css'])) add_action('wp_head', 'ruigehond006_stylesheet');
    }
}
function ruigehond006_stylesheet()
{
    echo '<style type="text/css">#ruigehond006_wrap{z-index:10001;position:fixed;display:block;left:0;width:100%;margin:0;overflow:visible}#ruigehond006_inner{position:absolute;height:0;width:inherit;background-color:rgba(255,255,255,.2);-webkit-transition:height .4s;transition:height .4s}html[dir=rtl] #ruigehond006_wrap{text-align:right}#ruigehond006_bar{width:0;height:100%;background-color:transparent}</style>';
}
// meta box exposes setting to display reading progress for an individual post
// https://developer.wordpress.org/reference/functions/add_meta_box/
function ruigehond006_meta_box_add($post_type = null)
{
    if (!$post_id = get_the_ID()) {
        return;
    }
    $option = get_option('ruigehond006');
    if (isset($option['post_types']) and in_array($post_type, $option['post_types'])) {
        return; // you can't set this if the bar is displayed by default on this post type
    }
    add_meta_box( // WP function.
        'ruigehond006', // Unique ID
        'WP Reading Progress', // Box title
        'ruigehond006_meta_box', // Content callback, must be of type callable
        $post_type, // Post type
        'normal',
        'low',
        array('option' => $option)
    );
}

function ruigehond006_meta_box($post, $obj)
{
    $option = $obj['args']['option']; // not used at this moment
    wp_nonce_field('ruigehond006_save', 'ruigehond006_nonce');
    echo '<input type="checkbox" id="ruigehond006_checkbox" name="ruigehond006_show"';
    if ('yes' === get_post_meta($post->ID, '_ruigehond006_show', true)) echo ' checked="checked"';
    echo '/> <label for="ruigehond006_checkbox">';
    echo __('display reading progress bar', 'wp-reading-progress');
    echo '</label>';
}

function ruigehond006_meta_box_save($post_id)
{
    if (!isset($_POST['ruigehond006_nonce']) || !wp_verify_nonce($_POST['ruigehond006_nonce'], 'ruigehond006_save'))
        return;
    if (!current_user_can('edit_post', $post_id))
        return;
    if (isset($_POST['ruigehond006_show'])) {
        add_post_meta($post_id, '_ruigehond006_show', 'yes', true);
    } else {
        delete_post_meta($post_id, '_ruigehond006_show');
    }
}

/**
 * manage global settings
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
            echo '<p>';
            echo __('This plugin displays a reading progress bar on your selected post types.', 'wp-reading-progress');
            echo ' ';
            echo __('When it does not find a single article, it uses the whole page to calculate reading progress.', 'wp-reading-progress');
            echo '<br/>';
            echo __('For post types which are switched off in the settings, you can activate the bar per post in the post-edit screen.', 'wp-reading-progress');
            echo '<br/>';
            echo __('Please use valid input or the bar might not display.', 'wp-reading-progress');
            echo '</p>';
        }, //callback
        'ruigehond006' // page
    );
    if (false === ($option = get_option('ruigehond006'))) {
        ruigehond006_add_defaults();
        $option = get_option('ruigehond006');
    }
    add_settings_field(
        'ruigehond006_bar_attach', // As of WP 4.6 this value is used only internally
        // use $args' label_for to populate the id inside the callback
        __('Stick the bar to this element', 'wp-reading-progress'), // title
        function ($args) {
            echo '<input type="text" name="ruigehond006[bar_attach]" value="';
            echo $args['option']['bar_attach'];
            echo '"/><div class="ruigehond006 explanation"><em>';
            // #translators: two links are inserted that set the value accordingly, 'top' and 'bottom'
            echo sprintf(__('Use %s or %s, or any VALID selector of a fixed element where the bar can be appended to, e.g. a sticky menu.', 'wp-reading-progress'),
                '<a>top</a>', '<a>bottom</a>');
            echo '</em></div>';
        }, // callback
        'ruigehond006', // page id
        'progress_bar_settings', // section id
        ['option' => $option] // args
    );
    add_settings_field(
        'ruigehond006_stick_relative',
        __('How to stick', 'wp-reading-progress'),
        function ($args) {
            echo '<label><input type="checkbox" name="ruigehond006[stick_relative]"';
            if (isset($args['option']['stick_relative']) && $args['option']['stick_relative']) {
                echo ' checked="checked"';
            }
            echo '/> ' . __('If the bar is too wide, try relative positioning by checking this box, or attach it to another element.', 'wp-reading-progress');
            //echo '<br/><em style="background-color:#ffc;">This option may be removed in a future release if nobody uses it, let me know if you want to keep it</em>';
            echo '</label>';
        },
        'ruigehond006',
        'progress_bar_settings',
        ['option' => $option] // args
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
        ['option' => $option] // args
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
        ['option' => $option] // args
    );
    add_settings_field(
        'ruigehond006_mark_it_zero',
        __('Make bar start at 0%', 'wp-reading-progress'),
        function ($args) {
            echo '<label><input type="checkbox" name="ruigehond006[mark_it_zero]" value="Yes"';
            if (isset($args['option']['mark_it_zero']) && $args['option']['mark_it_zero']) {
                echo ' checked="checked"';
            }
            echo '/> ' . __('Yes please', 'wp-reading-progress') . '</label>';
        },
        'ruigehond006',
        'progress_bar_settings',
        ['option' => $option] // args
    );
    add_settings_field(
        'ruigehond006_include_comments',
        __('On single post page', 'wp-reading-progress'),
        function ($args) {
            echo '<label><input type="checkbox" name="ruigehond006[include_comments]"';
            if (isset($args['option']['include_comments']) && $args['option']['include_comments']) {
                echo ' checked="checked"';
            }
            echo '/> ';
            echo __('use whole page to calculate reading progress', 'wp-reading-progress');
            //echo '<br/><em style="background-color:#ffc;">This option may be removed in a future release if nobody uses it, let me know if you want to keep it</em>';
            echo '</label>';
        },
        'ruigehond006',
        'progress_bar_settings',
        ['option' => $option] // args
    );
    add_settings_field(
        'ruigehond006_post_types',
        // #TRANSLATORS: this is followed by a list of the available post_types
        __('Show reading progress on', 'wp-reading-progress'),
        function ($args) {
            $post_types = [];
            if (isset($args['option']['post_types'])) {
                $post_types = $args['option']['post_types'];
            }
            foreach (get_post_types(array('public' => true)) as $post_type) {
                echo '<label><input type="checkbox" name="ruigehond006[post_types][]" value="' . $post_type . '"';
                if (in_array($post_type, $post_types)) {
                    echo ' checked="checked"';
                }
                echo '/> ' . $post_type . '</label><br/>';
            }
            echo '<div class="ruigehond006 explanation"><em>';
            echo __('For unchecked post types you can enable the reading progress bar per post on the post edit page.', 'wp-reading-progress');
            echo '</em></div>';
        },
        'ruigehond006',
        'progress_bar_settings',
        ['option' => $option] // args
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
        ['option' => $option] // args
    );
    add_settings_field(
        'ruigehond006_no_css',
        __('No css', 'wp-reading-progress'),
        function ($args) {
            echo '<label><input type="checkbox" name="ruigehond006[no_css]"';
            if (isset($args['option']['no_css'])) {
                echo ' checked="checked"';
            }
            echo '/> ';
            echo __('necessary css for the reading bar is included elsewhere', 'wp-reading-progress');
            echo '</label>';
        },
        'ruigehond006',
        'progress_bar_settings',
        ['option' => $option] // args
    );
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

function ruigehond006_settingslink($links)
{
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
function ruigehond006_add_defaults()
{
    add_option('ruigehond006', array(
        'bar_attach' => 'top',
        'bar_color' => '#f1592a',
        'bar_height' => '.5vh',
        'post_types' => array('post'),
    ), null, true);
}

function ruigehond006_install()
{
    if (!get_option('ruigehond006')) { // insert default settings:
        ruigehond006_add_defaults();
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
    delete_option('ruigehond006_upgraded_1.2.4');
    // remove the post_meta entries
    delete_post_meta_by_key('_ruigehond006_show');
}