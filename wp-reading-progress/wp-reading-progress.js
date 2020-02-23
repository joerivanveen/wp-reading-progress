if (document.readyState !== 'loading') {
    ruigehond006_start();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        ruigehond006_start();
    });
}
var ruigehond006_height = 0; // this just caches the window height
var ruigehond006_mark_it_zero = false; // caches the custom value for quick use in progress function

function ruigehond006_start() {
    if (typeof ruigehond006_custom === 'undefined') return;
    ruigehond006_mark_it_zero = ((typeof ruigehond006_custom.mark_it_zero !== 'undefined'));
    // custom object is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar
    (function ($) {
        var $p = $(ruigehond006_custom.post_identifier),
            p;
        if ($p.length === 1) {
            p = $p[0];
        } else { // default to body
            p = document.body;
        }
        ruigehond006_check_and_place_bar();
        $(window).on('load scroll', function () {
            ruigehond006_progress(p);
        }).on('resize', function () {
            ruigehond006_check_and_place_bar();
            ruigehond006_progress(p);
        });
    })(jQuery);
}

function ruigehond006_progress(p) {
    var loc = p.getBoundingClientRect(),
//        reading_left = Math.max(loc.bottom - ruigehond006_height, 0),
//        reading_done = 100 - (reading_left * 100 / loc.height);
        reading_left = Math.max(loc.bottom - ruigehond006_height, 0),
        // TODO make sure $ is ALWAYS available here
        reading_done = 100 - (reading_left * 100 / (loc.height - ((ruigehond006_mark_it_zero)?(ruigehond006_height - $(p).offset().top):0)));
    document.getElementById('ruigehond006_bar').style.width = reading_done + '%';
}

function ruigehond006_check_and_place_bar() {
    (function ($) {
        var $el = $(ruigehond006_custom.bar_attach),
            attach_is_hidden = $el.is(':hidden');
        ruigehond006_height = $(window).height();
        // attach the bar to body when selector is not valid
        if ($el.length !== 1 || attach_is_hidden) $el = $('body');
        // if not currently in that location, reattach the bar
        if ($el.children('.ruigehond006.progress').length === 0) {
            $('.ruigehond006.progress').remove();
            $el.append('<div class="ruigehond006 progress"><div id="ruigehond006_bar"></div></div>');
            $('#ruigehond006_bar').css({'background-color': ruigehond006_custom.bar_color});
            setTimeout(function () {
                $('.ruigehond006.progress').css({'height': ruigehond006_custom.bar_height});
            }, 500);
        }
        if (ruigehond006_custom.bar_attach === 'top' || attach_is_hidden) {
            var top = 0,
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
    })(jQuery);
}