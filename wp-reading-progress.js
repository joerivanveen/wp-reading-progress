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
        var $p = $(ruigehond006_custom.post_identifier);
        if ($p.length === 0) { // default to post
            $p = $('article.post');
        }
        if ($p.length === 1) {
            var p = $p[0];
            ruigehond006_check_and_place_bar();
            $(window).on('load scroll', function() {
                ruigehond006_progress(p);
            }).on('resize', function () {
                //ruigehond006_check_and_place_bar();
                ruigehond006_progress(p);
            });
        }
    })(jQuery);
}

function ruigehond006_progress(p) { // calculate progress depending on how much you've seen of the post
    (function ($) {
        var loc = p.getBoundingClientRect();
        var reading_left = Math.max(loc.bottom - $(window).height(), 0);
        var reading_done = 100 - (reading_left * 100 / loc.height);
        $('.ruigehond006.progress .bar').css({'width': reading_done + '%'});
    })(jQuery);
}

function ruigehond006_check_and_place_bar() {
    (function ($) {
        $('.ruigehond006.progress').remove();
        var $el = $(ruigehond006_custom.bar_attach);
        var attach_is_hidden = $el.is(':hidden');
        if ($el.length !== 1 || attach_is_hidden) { // attach the bar to body when selector is not valid
            $el = $('body');
        }
        $el.append('<div class="ruigehond006 progress"><div class="bar"></div></div>');
        $('.ruigehond006.progress .bar').css({'background-color': ruigehond006_custom.bar_color});
        if (ruigehond006_custom.bar_attach === 'top' || attach_is_hidden) {
            var top = 0;
            $adminbar = $('#wpadminbar');
            if ($adminbar.length > 0 && $adminbar.css('position') === 'fixed') {
                top = $adminbar.outerHeight() + 'px';
            }
            $('.ruigehond006.progress').css({
                'position': 'fixed',
                'top': top
            });
        } else if (ruigehond006_custom.bar_attach === 'bottom') {
            $('.ruigehond006.progress').css({
                'position': 'fixed',
                'bottom': '0'
            });
        }
        setTimeout(function () {
            $('.ruigehond006.progress').css({'height': ruigehond006_custom.bar_height});
        }, 500);
    })(jQuery);
}