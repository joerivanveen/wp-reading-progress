var ruigehond006_h = 0, /* this caches the window height */
    ruigehond006_f = 0, /* the correction of height when mark_it_zero (or 0 otherwise) */
    ruigehond006_a = null, /* the element the reading bar is positioned under (with fallback to top) */
    ruigehond006_t = 0, /* the top value (set to below the admin bar when necessary) */
    ruigehond006_i; /* interval that checks the position */
// TODO positioning not with whole pixels, not specific enough
// TODO the positionNicely is sometimes done while regular scrolling very slowly, the bar dissappThe poears then which is bad
function ruigehond006_start() {
    if (typeof ruigehond006_c === 'undefined') return;
    /* custom object ruigehond006_c is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar */
    (function ($) {
        var $p = $(ruigehond006_c.post_identifier),
            p, p_candidates;
        if ($p.length !== 1) { /* when not found, try to get the current post by id */
            $p = $('#post-' + ruigehond006_c.post_id);
        }
        if ($p.length === 1) {
            p = $p[0];
        } else {
            p = document.body;
        }
        if (!ruigehond006_c.include_comments) { /* now check if it has the internal content in a standard class */
            if ((p_candidates = p.querySelectorAll('.entry-content')).length === 1) {
                p = p_candidates[0];
            } else if ((p_candidates = p.querySelectorAll('.post-content')).length === 1) {
                p = p_candidates[0];
            } else if ((p_candidates = p.querySelectorAll('.main-content')).length === 1) {
                p = p_candidates[0];
            }
        }
        ruigehond006_check_and_place_bar(p);
        $(window).on('load scroll', function () {
            ruigehond006_progress(p); /* also calls position function */
        }).on('resize', function () {
            ruigehond006_check_and_place_bar(p); /* will call progress function */
        });
    })(jQuery);
}

function ruigehond006_progress(p) {
    /* loc.height in pixels = total amount that can be read */
    var top, loc = p.getBoundingClientRect(),
        loc_height = loc.height - ruigehond006_f,
        reading_left = Math.max(Math.min(loc.bottom - ruigehond006_h, loc_height), 0), /* in pixels */
        reading_done = 100 * (loc_height - reading_left) / loc_height; /* in percent */
    document.getElementById('ruigehond006_bar').style.width = reading_done + '%';
    if ((top = ruigehond006_position()) > -1) document.getElementById('ruigehond006_wrap').style.top = top.toString() + 'px';
}

function ruigehond006_position() {
    var bottom, top, wrap = document.getElementById('ruigehond006_wrap');
    if (ruigehond006_c.bar_attach === 'bottom') return -1;
    clearInterval(ruigehond006_i);
    if (ruigehond006_a && (bottom = ruigehond006_a.getBoundingClientRect().bottom)) {
        top = parseInt(Math.max(bottom, ruigehond006_t));
    } else if (ruigehond006_c.bar_attach === 'top') {
        top = ruigehond006_t;
    }
    ruigehond006_i = window.setInterval(ruigehond006_positionNicely, 100);
    if (top !== parseInt(wrap.style.top)) {return top;}
    return -1; /* no work necessary */
}

function ruigehond006_positionNicely() {
    var wrap, top;
    if ((top = ruigehond006_position()) > -1) {
        console.warn(top);
        wrap = document.getElementById('ruigehond006_wrap');
        wrap.style.opacity = '0';
        wrap.style.top = top.toString() + 'px';
        setTimeout(function () {
            wrap.classList.add('initialize');
            setTimeout(function() {
                wrap.style.opacity = '1';
                wrap.classList.remove('initialize');
            }, 400);
        }, 400);
    }
}

function ruigehond006_check_and_place_bar(p) {
    (function ($) {
        var $adminbar = $('#wpadminbar');
        ruigehond006_a = ((ruigehond006_a = $(ruigehond006_c.bar_attach))) ? ruigehond006_a[0] : null;
        ruigehond006_h = $(window).height();
        if (typeof ruigehond006_c.mark_it_zero !== 'undefined') {
            ruigehond006_f = Math.max(ruigehond006_h - $(p).offset().top, 0); /* math.max for when article is off screen */
        }
        /* attach the bar to DOM (body) if not already there, you only have to do this once */
        if (!document.getElementById('ruigehond006_bar')) {
            document.body.insertAdjacentHTML('beforeend', /* todo remove the css class names */
                '<div id="ruigehond006_wrap" class="ruigehond006 progress"><div id="ruigehond006_bar" role="progressbar"></div></div>');
            $('#ruigehond006_bar').css({'background-color': ruigehond006_c.bar_color});
            if (ruigehond006_c.bar_attach === 'bottom') {
                $('#ruigehond006_wrap').css({
                    'bottom': '0',
                });
            }
            if (ruigehond006_a) { /* TODO make it a setting? or just do it? */
                ruigehond006_i = window.setInterval(ruigehond006_positionNicely, 100);
            }
        }
        if ($adminbar.length > 0 && $adminbar.css('position') === 'fixed') {
            ruigehond006_t = parseInt($adminbar.outerHeight()); /* default is '0' */
        }
        ruigehond006_progress(p);
        setTimeout(function() {
            $('#ruigehond006_wrap').css({
                'height': ruigehond006_c.bar_height,
            });
        }, 50);
    })(jQuery);
}

/* only after everything is locked and loaded we’re initialising the progress bar */
if (document.readyState === "complete") {
    setTimeout(ruigehond006_start, 450);
} else {
    window.addEventListener('load', function (event) {
        setTimeout(ruigehond006_start, 450);
    });
}