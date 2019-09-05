=== WP Reading Progress ===
Contributors: ruigehond
Tags: reading, progress, progressbar
Donate link: https://paypal.me/ruigehond
Requires at least: 4.5
Tested up to: 5.2.3
Requires PHP: 5.4
Stable tag: trunk
License: GPLv3

Light weight fully customizable reading progress bar. Sticks to top, bottom or sticky menu, with fallback for small screens

== Description ==
The reading progress bar is a great user experience on longreads. Especially if it accurately depicts the reading progress in the article text, and nothing else. This is standard on single blog posts and enabled by default.

Customization:

- location top of screen, bottom of screen or below a sticky menu

- choose your color of the reading progress bar

- possibility to use the whole page, not only the article, on single blog posts

- select other (custom) post types you wish the bar to appear

- activate reading progress for archive pages (I would leave that unchecked)

Behaviour:

- The reading progress bar has smooth initializing since part of the text may already be visible, after that a lightweight update-function ensures quick response while scrolling

- When the sticky menu disappears due to a media query (for instance), the progress bar automatically defaults to displaying at the top of the screen

- Background is transparent white, only there for subtle contrast

This is my 6th Wordpress plugin but my first one freely available to everybody. I hope you enjoy using it as much as I enjoy building it!

Feel free to fork it on Github as well, if you want to play with the code

Regards,
Joeri (ruige hond)

== Installation ==
1. Install the plugin by clicking 'Install now' below, or by downloading the code an pasting it in your plugins folder

2. By default it only works on single blog posts and uses an orange colour

3. Go to settings->WP Reading Progress to customize it

It uses one option array which is removed upon uninstall, leaving no traces

== Screenshots ==
1. WP Reading Progress settings page
2. Example of the reading progress bar on my photography blog

== Changelog ==
1.0.2: fixed translation, translated to Dutch

1.0.1: minified javascript and css, fixed issue of bar sometimes momentarily disappearing on mobile device while scrolling

1.0.0: official release

0.0.4 ~ 0.0.6: fixed bugs in safari: progress bar would lag or not be visible on older iPads

0.0.3: improved initializing cross browser

0.0.2: smoother initializing, added customizing of location, color and post types / archive

0.0.1: reading progress bar works on single blog post, no customizing is possible