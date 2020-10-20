=== WP Reading Progress ===
Contributors: ruigehond
Tags: reading, progress, progressbar
Donate link: https://paypal.me/ruigehond
Requires at least: 4.5
Tested up to: 5.5
Requires PHP: 5.4
Stable tag: trunk
License: GPLv3

Light weight fully customizable reading progress bar. Sticks to top, bottom or sticky menu, with fallback for small screens

== Description ==
The reading progress bar is a great user experience on longreads. Especially if it accurately depicts the reading progress in the article text, and nothing else. This is standard on single blog posts and enabled by default.

Customization:

- Location top of screen, bottom of screen or below a sticky menu

- Choose color of the reading progress bar

- Have the bar start at 0% even when part of the article is visible

- Select post types you wish the bar to appear, or individual posts

Behaviour:

- The reading progress bar has smooth initializing since part of the text may already be visible, after that a lightweight update-function ensures quick response while scrolling

- When the sticky menu disappears during resizing or scrolling the progress bar automatically defaults to displaying at the top of the screen

- If there is no single article identified (by class names or id) it uses the whole page to calculate progress

- Attachment to a sticky element can be either absolute (default) or relative (use the checkbox in settings)

This is my 6th Wordpress plugin but my first one freely available to everybody. I hope you enjoy using it as much as I enjoy building it!

=== IMPORTANT NOTES: ===

- css classes 'ruigehond006' and 'progress' are scheduled for removal in a next version, if you target the bar in css use '#ruigehond006_inner'.

- Option 'use whole page to calculate reading progress' is scheduled for removal in a next version, unless someone really, really wants to use it (contact me).


Regards,
Joeri (ruige hond)

== Installation ==
1. Install the plugin by clicking 'Install now' below, or the 'Download' button, and put the WP-reading-progress folder in your plugins folder

2. By default it only works on single blog posts and uses an orange colour

3. Go to settings->WP Reading Progress to customize it

Upon uninstall WP Reading Progress removes its own options and post_meta data (if any) leaving no traces.

== Screenshots ==
1. Example of the reading progress bar on my photography blog
2. WP Reading Progress settings page
3. Activate the bar for an individual post (if that post type is not enabled)

== Changelog ==

1.3.2: bugfix getBoundingClientRect does not work on iOS 8 and 9 (at least), now using custom function for it

1.3.1: some optimizations regarding the on scroll function

1.3.0: now positions itself snugly to element using top-margin or fixed automatically to top when element is not in viewport or gone

1.2.5: improved fallback for mobile, added rtl support (html tag must contain dir="rtl")

1.2.4: added regular post type to settings, added fallback find post by id when not found by class names, added option to display on specific posts only

1.2.3: fixed bug initializing window height to 0 on page load in some cases

1.2.2: increased compatibility with themes regarding looking for single article

1.2.1: added option to start bar at 0%, slightly optimized progress function

1.2.0: improved behaviour upon resize of the window

1.1.0: now identifies single post reading area for all post-types, fallback to body when not found in DOM

1.0.3: fixed translation, corrected license indication

1.0.2: translated to Dutch

1.0.1: minified javascript and css, fixed issue of bar sometimes momentarily disappearing on mobile device while scrolling

1.0.0: release

== Upgrade Notice ==

= 1.3.2 =

The way the bar sticks to another element is greatly improved, if you use it with a sticky element please check whether it still behaves as you expect, or stick it to a better element from now on.
