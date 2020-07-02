var ruigehond006_h = 0, /* this caches the window height */
    ruigehond006_f = 0, /* the correction of height when mark_it_zero (or 0 otherwise) */
    ruigehond006_a = null, /* the element the reading bar is positioned under (with fallback to top) */
    ruigehond006_t = 0; /* the top value (set to below the admin bar when necessary) */

function ruigehond006_start() {
    if (typeof ruigehond006_c === 'undefined') return;
    /* custom object ruigehond006_c is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar */
    (function ($) {
        var $p = $(ruigehond006_c.post_identifier),
            p, p_candidates;
        if ($p.length !== 1) { /* when not found conclusively, try to get the current post by id */
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
        ruigehond006_Initialize(p);
        $(window).on('load scroll', function () {
            ruigehond006_progress(p); /* @since 1.3.0 also manages position in DOM */
        }).on('resize', function() {
            ruigehond006_Initialize(p);
        });
    })(jQuery);
}

function ruigehond006_progress(p) {
    /* loc.height in pixels = total amount that can be read */
    var obj, loc = p.getBoundingClientRect(),
        loc_height = loc.height - ruigehond006_f,
        reading_left = Math.max(Math.min(loc.bottom - ruigehond006_h, loc_height), 0), /* in pixels */
        reading_done = 100 * (loc_height - reading_left) / loc_height; /* in percent */
    document.getElementById('ruigehond006_bar').style.width = reading_done + '%';
    ruigehond006_BarInDom();
}

function ruigehond006_Initialize(p) {
    (function ($) {
        var wrap, $adminbar = $('#wpadminbar');
        ruigehond006_h = $(window).height();
        if (typeof ruigehond006_c.mark_it_zero !== 'undefined') {
            ruigehond006_f = Math.max(ruigehond006_h - $(p).offset().top, 0); /* math.max for when article is off screen */
        }
        if ($adminbar.length > 0 && $adminbar.css('position') === 'fixed') {
            ruigehond006_t = parseInt($adminbar.outerHeight()); /* default is '0' */
        }
        if (!document.getElementById('ruigehond006_bar')) {
            document.body.insertAdjacentHTML('beforeend', /* todo remove the css class names */
                '<div id="ruigehond006_wrap" class="ruigehond006 progress"><div id="ruigehond006_bar" role="progressbar"></div></div>');
            document.getElementById('ruigehond006_bar').style.backgroundColor = ruigehond006_c.bar_color;
            wrap = document.getElementById('ruigehond006_wrap');
            wrap.style.height = ruigehond006_c.bar_height; // TODO initialize smoothly again
            wrap.setAttribute('data-ruigehond010', 'fixed');
            if (ruigehond006_c.bar_attach === 'bottom') {
                wrap.style.bottom = '0';
            }
        }
        ruigehond006_progress(p);
    })(jQuery);
}

function ruigehond006_BarInDom() {
    var rect, top, marge, wrap;
    if (ruigehond006_c.bar_attach === 'bottom') return;
    wrap = document.getElementById('ruigehond006_wrap');
    if ((ruigehond006_a = document.querySelector(ruigehond006_c.bar_attach))) {
        rect = ruigehond006_a.getBoundingClientRect();
        top = rect.bottom;
        if (top < ruigehond006_t) { // stick to top
            if (wrap.getAttribute('data-ruigehond010') !== 'fixed') {
                wrap.style.position = 'fixed';
                wrap.style.top = ruigehond006_t.toString() + 'px';
                wrap.setAttribute('data-ruigehond010', 'fixed');
                document.body.insertAdjacentElement('beforeend', wrap);
            }
        } else { // attach to the element
            if (wrap.getAttribute('data-ruigehond010') !== 'sticky') {
                wrap.style.position = 'absolute';
                wrap.setAttribute('data-ruigehond010', 'sticky');
                ruigehond006_a.insertAdjacentElement('afterend', wrap);
                // TODO make sure it's always snug against the element
                console.log(wrap.getBoundingClientRect().top + ' / ' + top);
                //marge = top - wrap.getBoundingClientRect().top;
                //wrap.style.marginTop = marge.toString() + 'px';
            }
        }
    } else { // bar_attach must be top
        document.body.insertAdjacentElement('beforeend', wrap);
        wrap.style.position = 'fixed';
        wrap.style.top = ruigehond006_t.toString() + 'px';
    }
}

/* only after everything is locked and loaded we’re initialising the progress bar */
if (document.readyState === "complete") {
    setTimeout(ruigehond006_start, 450);
} else {
    window.addEventListener('load', function (event) {
        setTimeout(ruigehond006_start, 450);
    });
}