var ruigehond006_h = 0, /* this caches the window height */
    ruigehond006_f = 0, /* the correction of height when mark_it_zero (or 0 otherwise) */
    ruigehond006_a = null, /* the element the reading bar is positioned under (with fallback to top) */
    ruigehond006_t = 0, /* the top value (set to below the admin bar when necessary) */
    ruigehond006_s = null; /* keeps track of whether the bar is sticky (true) or not (false) */

function ruigehond006_Start() {
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
        if (ruigehond006_c.ert > 0) p.ruigehond006_ert = ruigehond006_c.ert;
        ruigehond006_Initialize(p);
        $(window).on('load scroll', function () {
            ruigehond006_Progress(p); // @since 1.3.0 also manages position in DOM
        }).on('resize', function () { // TODO debounce https://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
            ruigehond006_Initialize(p);
        });
    })(jQuery);
}

function ruigehond006_Initialize(p) {
    (function ($) {
        var $adminbar = $('#wpadminbar');
        ruigehond006_h = $(window).height();
        if (typeof ruigehond006_c.mark_it_zero !== 'undefined') {
            ruigehond006_f = Math.max(ruigehond006_h - $(p).offset().top, 0); // Math.max for when article is off screen
        }
        ruigehond006_t = ($adminbar.length > 0 && $adminbar.css('position') === 'fixed') ? parseInt($adminbar.outerHeight()) : 0;
        if (!document.getElementById('ruigehond006_bar')) {
            document.body.insertAdjacentHTML('beforeend', // todo remove the css class names
                '<div id="ruigehond006_wrap"><div id="ruigehond006_inner"><div id="ruigehond006_bar" role="progressbar"></div></div></div>');
            //document.getElementById('ruigehond006_bar').style.backgroundColor = ruigehond006_c.bar_color;
            if (ruigehond006_c.bar_attach === 'bottom') {
                document.getElementById('ruigehond006_wrap').style.bottom = '0';
                document.getElementById('ruigehond006_inner').style.bottom = '0';
            }
        }
        ruigehond006_Progress(p);
        if (!document.getElementById('ruigehond006_inner').style.height) {
            setTimeout(function () {
                requestAnimationFrame(function () {
                    document.getElementById('ruigehond006_inner').style.height = ruigehond006_c.bar_height;
                });
            }, 350); // TODO this is not cool, but you have to wait for reflow to position the bar
        }
    })(jQuery);
}

function ruigehond006_Progress(p) {
    var loc = p.getBoundingClientRect(), // loc.height in pixels = total amount that can be read/
        loc_height = loc.height - ruigehond006_f,
        reading_left = Math.max(Math.min(loc.bottom - ruigehond006_h, loc_height), 0), // in pixels
        reading_done = 100 * (loc_height - reading_left) / loc_height; // in percent
    requestAnimationFrame(function () {
        document.getElementById('ruigehond006_bar').style.width = reading_done + '%';
        if (ruigehond006_c.bar_attach !== 'bottom') ruigehond006_BarInDom();
    });
}

function ruigehond006_BarInDom() {
    // On older iPads (at least iOS 8 + 9) the getBoundingClientRect() gets migrated all the way outside the
    // viewport while scrolling with touch, so don’t use it
    var top, new_margin, old_margin,
        wrap = document.getElementById('ruigehond006_wrap'),
        inner = document.getElementById('ruigehond006_inner');
    //if (ruigehond006_c.bar_attach === 'bottom') return; // this function should not be called in that case at all to avoid overhead
    if ((ruigehond006_a = document.querySelector(ruigehond006_c.bar_attach))) { // it can disappear so you need to check every time
        top = ruigehond006_a.offsetHeight + ruigehond006_boundingClientTop(ruigehond006_a);
        if (top <= ruigehond006_t) { // stick to top
            if (false !== ruigehond006_s) ruigehond006_BarToTop(wrap, inner);
        } else { // attach to the element
            requestAnimationFrame(function () {
                if (true !== ruigehond006_s) {
                    ruigehond006_s = true;
                    if (typeof ruigehond006_c.stick_relative !== 'undefined') {
                        wrap.style.position = 'relative';
                    } else {
                        wrap.style.position = 'absolute';
                        wrap.style.top = 'inherit';
                    }
                    ruigehond006_a.insertAdjacentElement('beforeend', wrap); // always attach as a child to ensure smooth operation
                    //console.log('attach bar to the element');
                }
                // make sure it’s always snug against the element using top margin
                // inside requestAnimationFrame properties of the element might be different than before
                top = ruigehond006_a.offsetHeight + ruigehond006_boundingClientTop(ruigehond006_a);
                new_margin = (old_margin = (parseFloat(inner.style.marginTop) || 0)) + top - ruigehond006_boundingClientTop(inner);
                if (new_margin !== old_margin) {
                    inner.style.marginTop = new_margin.toString() + 'px';
                    //console.warn('set margin from ' + old_margin + ' to ' + new_margin);
                }
                //console.warn(top + ' vs ' + ruigehond006_boundingClientTop(inner) + ' vs ' + inner.getBoundingClientRect().top);
            });
        }
    } else { // bar_attach must be top
        if (false !== ruigehond006_s) ruigehond006_BarToTop(wrap, inner);
    }
}

function ruigehond006_boundingClientTop(el) {
    var elementTop = 0, scrollTop = window.scrollY;
    // don't use offsetParent, many browsers return 'null' if the position is 'fixed' (and also if you're at the top...),
    // rendering the functionality useless
    while (el.parentNode) {
        elementTop += el.offsetTop;
        if (scrollTop > 0 && window.getComputedStyle(el).getPropertyValue('position').toLowerCase() === 'fixed') {
            scrollTop = 0;
        }
        el = el.parentNode;
    }
    return elementTop - scrollTop;
}

function ruigehond006_BarToTop(wrap, inner) {
    //if (false === ruigehond006_s) return; // this function should not be called at all then to avoid overhead
    ruigehond006_s = false; // no longer sticky
    requestAnimationFrame(function () {
        wrap.style.position = 'fixed';
        wrap.style.top = ruigehond006_t.toString() + 'px';
        inner.style.marginTop = '0';
        document.body.insertAdjacentElement('beforeend', wrap);
    });
}

/* only after everything is locked and loaded we’re initialising the progress bar */
if (document.readyState === 'complete') {
    setTimeout(ruigehond006_Start, 350);
} else {
    window.addEventListener('load', function (event) {
        setTimeout(ruigehond006_Start, 350);
    });
}