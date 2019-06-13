if (document.readyState !== 'loading') {
    ruigehond006_start();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        ruigehond006_start();
    });
}

function ruigehond006_start() {
    if (typeof ruigehond006_custom === 'undefined') {
        return;
    }
    (function ($) {
        $p = $(ruigehond006_custom.post_identifier);
        if ($p.length === 1) {
            let p = $p[0];
            // create bar and set custom values provided by user (available through wp_localize_script from wp-reading-progress.php)
            let $el = $(ruigehond006_custom.bar_attach);
            if ($el.length !== 1) {
                $el = $('body');
            }
            $el.append('<div class="ruigehond006 progress"><div class="bar"></div></div>');
            $('.ruigehond006.progress .bar').css({'background-color': ruigehond006_custom.bar_color});
            $('.ruigehond006.progress').css({'height': ruigehond006_custom.bar_height});
            if (ruigehond006_custom.bar_attach === 'top') {
                let top = 0;
                if ($('#wpadminbar').length > 0) {
                    top = $('#wpadminbar').outerHeight();
                }
                $('.ruigehond006.progress').css({'position': 'fixed', 'top': top + 'px'});
            } else if (ruigehond006_custom.bar_attach === 'bottom') {
                $('.ruigehond006.progress').css({'position': 'fixed', 'bottom': '0px'});
            }
            ruigehond006_progress(p);
            window.addEventListener("scroll", function () {
                ruigehond006_progress(p);
            }, false);
        }
    })(jQuery);
}

function ruigehond006_progress(p) { // calculate progress depending on how much you've seen of the post
    (function ($) {
        let loc = p.getBoundingClientRect();
        let reading_left = Math.max(loc.bottom - $(window).height(), 0);
        let reading_done = 100 - (reading_left * 100 / loc.height);
        $('.ruigehond006.progress .bar').css({'width': reading_done + '%'});
    })(jQuery);
}

