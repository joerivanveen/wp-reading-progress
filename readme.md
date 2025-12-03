# WP reading progress

Light weight fully customizable reading progress bar for WordPress websites. Sticks to top, bottom or sticky menu, with fallback for small screens.

Get it on WordPress: <https://wordpress.org/plugins/wp-reading-progress/>

## Description
The reading progress bar is a great user experience on longreads. Especially if it accurately depicts the reading progress in the article text, and nothing else. This is standard on single blog posts and enabled by default.

### Customization:

- Location top of screen, bottom of screen or below sticky elements.
- Select post types you wish the bar to appear, or individual posts.
- Choose color of the reading progress bar.
- Have the bar start at 0% even when part of the article is visible.

### Behaviour:

- The reading progress bar has smooth initializing since part of the text may already be visible, after that a lightweight update-function ensures quick response while scrolling.
- The bar can attach itself to multiple (sticky) elements that you define as an admin, the first visible element will be used.
- When there is no (longer a) visible element to attach to, the bar displays at the top.
- Use `dir=rtl` on your html tag to have the bar display correctly for right-to-left languages.

### Estimated reading time (beta)

Since 1.6.0 this plugin can display ‘estimated reading time’ (ert), for when your theme does not support it out of the box.
There are some issues with ert, some of which cannot be fixed from a plugin. If it does not work for you, switch it off. It will have no effect on your website then.

Regards,
Joeri (wp-developer.eu)