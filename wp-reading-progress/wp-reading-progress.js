if (document.readyState !== 'loading') {
    ruigehond006_start();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        ruigehond006_start();
    });
}
var ruigehond006_h = 0; // this caches the window height
var ruigehond006_f = 0; // the correction of height when mark_it_zero (or 0 otherwise)

function ruigehond006_start() {
    if (typeof ruigehond006_c === 'undefined') return;
    // custom object ruigehond006_c is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar
    (function ($) {
        var $p = $(ruigehond006_c.post_identifier),
            p, p_candidates;
        if ($p.length === 1) {
            p = $p[0];
            // check if it has the internal content in a standard class (to exclude widgets and comments etc.)
            if ((p_candidates = $(p).find('.entry-content')).length === 1) {
                p = p_candidates[0];
            } else if ((p_candidates = $(p).find('.post-content')).length === 1) {
                p = p_candidates[0];
            }
        } else { // TODO try some other stuff or make it a setting?
            p = document.body;
        }
        ruigehond006_check_and_place_bar(p);
        $(window).on('load scroll', function () {
            ruigehond006_progress(p);
        }).on('resize', function () {
            ruigehond006_check_and_place_bar(p);
            ruigehond006_progress(p);
        });
    })(jQuery);
}

function ruigehond006_progress(p) {
    // loc.height in pixels = total amount that can be read
    var loc = p.getBoundingClientRect(),
        loc_height = loc.height - ruigehond006_f,
        reading_left = Math.max(Math.min(loc.bottom - ruigehond006_h, loc_height), 0), // in pixels
        reading_done = 100 * (loc_height - reading_left) / loc_height; // in percent
    document.getElementById('ruigehond006_bar').style.width = reading_done + '%';
}

function ruigehond006_check_and_place_bar(p) {
    (function ($) {
        var $el = $(ruigehond006_c.bar_attach),
            attach_is_hidden = $el.is(':hidden');
        ruigehond006_h = $(window).height();
        if (typeof ruigehond006_c.mark_it_zero !== 'undefined') {
            ruigehond006_f = Math.max(ruigehond006_h - $(p).offset().top, 0); // math.max for when article is off screen
        }
        // attach the bar to body when selector is not valid
        if ($el.length !== 1 || attach_is_hidden) $el = $('body');
        // if not currently in that location, reattach the bar
        if ($el.children('.ruigehond006.progress').length === 0) {
            $('.ruigehond006.progress').remove();
            $el.append('<div class="ruigehond006 progress"><div id="ruigehond006_bar"></div></div>');
            $('#ruigehond006_bar').css({'background-color': ruigehond006_c.bar_color});
            setTimeout(function () {
                $('.ruigehond006.progress').css({'height': ruigehond006_c.bar_height});
            }, 500);
        }
        if (ruigehond006_c.bar_attach === 'top' || attach_is_hidden) {
            var top = 0,
                $adminbar = $('#wpadminbar');
            if ($adminbar.length > 0 && $adminbar.css('position') === 'fixed') {
                top = $adminbar.outerHeight() + 'px';
            }
            $('.ruigehond006.progress').css({
                'position': 'fixed',
                'top': top,
                'left': '0px',
            });
        } else if (ruigehond006_c.bar_attach === 'bottom') {
            $('.ruigehond006.progress').css({
                'position': 'fixed',
                'bottom': '0',
                'left': '0px',
            });
        }
    })(jQuery);
}