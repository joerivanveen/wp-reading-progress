var ruigehond006_h = 0, /* this caches the window height */
    ruigehond006_f = 0, /* the correction of height when mark_it_zero (or 0 otherwise) */
    ruigehond006_a = null, /* the element the reading bar is positioned under (with fallback to top) */
    ruigehond006_t = 0, /* the top value (set to below the admin bar when necessary) */
    ruigehond006_s = null; /* keeps track of whether the bar is sticky (true) or not (false) */

function ruigehond006_Start() {
    if (typeof ruigehond006_c === 'undefined') return;
    /* custom object ruigehond006_c is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar */
    var $p = document.querySelectorAll(ruigehond006_c.post_identifier),
        p, p_candidates;
    /* when not found conclusively, try to get the current post by id, or default to the whole body */
    p = ($p.length === 1) ? $p[0] : document.getElementById('post-' + ruigehond006_c.post_id) || document.body;
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
    /* event listeners */
    window.addEventListener('load', function () {
        ruigehond006_Progress(p);
    });
    window.addEventListener('scroll', function () {
        ruigehond006_Progress(p);
    });
    window.addEventListener('resize', function () {
        clearTimeout(window.ruigehond006_tt);
        window.ruigehond006_tt = setTimeout(function() {
            ruigehond006_Initialize(p);
        }, 300); // debounce / throttle resize event
    });
}

function ruigehond006_Initialize(p) {
    var adminbar = document.getElementById('wpadminbar');
    ruigehond006_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (typeof ruigehond006_c.mark_it_zero !== 'undefined') {
        ruigehond006_f = Math.max(ruigehond006_h - (ruigehond006_boundingClientTop(p) + window.pageYOffset), 0); // math.max for when article is off screen
    }
    ruigehond006_t = (adminbar !== null && window.getComputedStyle(adminbar).getPropertyValue('position') === 'fixed')
        ? adminbar.getBoundingClientRect().height : 0;
    if (!document.getElementById('ruigehond006_bar')) {
        document.body.insertAdjacentHTML('beforeend', // todo remove the css class names
            '<div id="ruigehond006_wrap"><div id="ruigehond006_inner" class="ruigehond006 progress"><div id="ruigehond006_bar" role="progressbar"></div></div></div>');
        //document.getElementById('ruigehond006_bar').style.backgroundColor = ruigehond006_c.bar_color; // now in css
        if (ruigehond006_c.bar_attach === 'bottom') {
            document.getElementById('ruigehond006_wrap').style.bottom = '0';
            document.getElementById('ruigehond006_inner').style.bottom = '0';
        }
    }
    ruigehond006_Progress(p);
    setTimeout(function () {
        var inner_element = document.getElementById('ruigehond006_inner');
        ruigehond006_Progress(p); // this may also have changed after reflow
        if (!inner_element.style.height) {
            requestAnimationFrame(function () {
                inner_element.style.height = ruigehond006_c.bar_height;
            });
        }
        // ert
        if (ruigehond006_c.ert && !document.getElementById('ruigehond006_ert')) {
            document.body.insertAdjacentHTML('beforeend', '<div id="ruigehond006_ert">' + ruigehond006_c.ert + '</div>');
        }
    }, 500); // TODO this is not cool, but after resizing you have to wait for things (reflow??) to position the bar
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
    if ((loc = document.getElementById('ruigehond006_ert'))) {
        loc.innerHTML = ruigehond006_c.ert * reading_done / 100.0;
    }
}

function ruigehond006_BarInDom() {
    var top, new_margin, old_margin,
        wrap = document.getElementById('ruigehond006_wrap'),
        inner = document.getElementById('ruigehond006_inner');
    //if (ruigehond006_c.bar_attach === 'bottom') return; // this function should not be called in that case at all to avoid overhead
    if ((ruigehond006_a = document.querySelector(ruigehond006_c.bar_attach))) { // it may disappear so you need to check every time
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
    var elementTop = 0, scrollTop = window.pageYOffset;
    // On older iPads (at least iOS 8 + 9) the getBoundingClientRect() gets migrated all the way outside the
    // viewport while scrolling with touch, so don’t use it
    // offsetParent: many browsers return 'null' if the position is 'fixed' (and also if you're at the top...), but some don’t
    while (el) {
        elementTop += el.offsetTop;
        if (scrollTop > 0
            && ('fixed' === (el.style.position.toLowerCase()
                || window.getComputedStyle(el).getPropertyValue('position').toLowerCase()))) {
            return elementTop;
        }
        el = el.offsetParent; // this is either null (ending while) or an error / nonsense, also ending the while I think
    }
    return elementTop - scrollTop;
}

function ruigehond006_BarToTop(wrap, inner) {
    //if (false === ruigehond006_s) return; // this function should not be called at all then to avoid overhead
    ruigehond006_s = false; // no longer sticky
    requestAnimationFrame(function () {
        var wrap_style = wrap.style;
        wrap_style.position = 'fixed';
        wrap_style.top = ruigehond006_t.toString() + 'px';
        inner.style.marginTop = '0';
        document.body.insertAdjacentElement('beforeend', wrap);
    });
}

/* only after everything is locked and loaded we’re initialising the progress bar */
if (document.readyState === 'complete') {
    setTimeout(ruigehond006_Start, 350);
} else {
    window.addEventListener('load', function () {
        setTimeout(ruigehond006_Start, 350);
    });
}