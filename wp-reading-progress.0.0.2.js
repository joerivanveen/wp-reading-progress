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
    } // this object is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar
    (function ($) {
        let $p = $(ruigehond006_custom.post_identifier);
        if ($p.length === 0) { // default to post
            $p = $('article.post');
        }
        if ($p.length === 1) {
            let p = $p[0];
            ruigehond006_check_and_place_bar();
            setTimeout(function () { // many a times it stays empty until scrolling if you don't use a tiny timeout
                ruigehond006_progress(p);
            }, 100);
            setTimeout(function(){
                $('.ruigehond006.progress .bar').css({'transition': 'none', '-webkit-transition': 'none'});
            },1000); // remove initial flowiness because it would lead to sluggishness
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

window.onresize = function () {
    ruigehond006_check_and_place_bar();
};

function ruigehond006_check_and_place_bar() {
    (function ($) {
        if ($('.ruigehond006.progress').is(':hidden')) { // e.g. when mobile lacks sticky menu the bar can become hidden
            $('.ruigehond006.progress').remove();
            ruigehond006_custom.bar_attach = 'top'; // default to top on mobile
        }
        let $el = $(ruigehond006_custom.bar_attach);
        if ($el.length !== 1) { // attach the bar to body when selector is not valid
            $el = $('body');
        }
        $el.append('<div class="ruigehond006 progress"><div class="bar"></div></div>');
        $('.ruigehond006.progress .bar').css({'background-color': ruigehond006_custom.bar_color});
        $('.ruigehond006.progress').css({'height': ruigehond006_custom.bar_height});
        if (ruigehond006_custom.bar_attach === 'top') {
            let top = 0;
            $adminbar = $('#wpadminbar');
            if ($adminbar.length > 0 && $adminbar.css('position') === 'fixed') {
                top = $adminbar.outerHeight();
            }
            $('.ruigehond006.progress').css({
                'position': 'fixed',
                'top': top + 'px'
            });
        } else if (ruigehond006_custom.bar_attach === 'bottom') {
            $('.ruigehond006.progress').css({
                'position': 'fixed',
                'bottom': '0px'
            });
        }
    })(jQuery);
}

