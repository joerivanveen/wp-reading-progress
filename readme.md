# WP reading progress

Light weight fully customizable reading progress bar. Sticks to top, bottom or sticky menu, with fallback for small screens.

Get it on WordPress: <https://wordpress.org/plugins/wp-reading-progress/>

## Description
The reading progress bar is a great user experience on longreads. Especially if it accurately depicts the reading progress in the article text, and nothing else. This is standard on single blog posts and enabled by default.

Customization:

- Location top of screen, bottom of screen or below a sticky menu.
- Choose color of the reading progress bar.
- Have the bar start at 0% even when part of the article is visible.
- Select post types you wish the bar to appear, or individual posts.

Behaviour:

- The reading progress bar has smooth initializing since part of the text may already be visible, after that a lightweight update-function ensures quick response while scrolling.
- The bar can attach itself to any (sticky) element that you can define as an admin, the first selected visible element will be used.
- When there is no (longer a) visible element to attach to, the bar displays at the top.
- If there is no single article identified (by class names or id) it uses the whole page to calculate progress.

Regards,
Joeri (ruige hond)