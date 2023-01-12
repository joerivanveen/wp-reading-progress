function ruigehond006() {
    let windowHeight = 0, /* this caches the window height */
        heightCorrection = 0, /* the correction of height when mark_it_zero (or 0 otherwise) */
        ruigehond006_a = null, /* the element the reading bar is positioned under (with fallback to top) */
        fromTop = 0, /* the top value (set to below the admin bar when necessary) */
        p_candidates, p, tt,
        a_candidates = [];
    /* custom object ruigehond006_c is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar */
    if (typeof ruigehond006_c === 'undefined') return;
    p_candidates = document.querySelectorAll(ruigehond006_c.post_identifier);
    /* when not found conclusively, try to get the current post by id, or default to the whole body */
    p = (p_candidates.length === 1) ? p_candidates[0] : document.getElementById('post-' + ruigehond006_c.post_id) || document.body;
    if (!ruigehond006_c.include_comments) { /* now check if it has the internal content in a standard class */
        if ((p_candidates = p.querySelectorAll('.entry-content')).length === 1) {
            p = p_candidates[0];
        } else if ((p_candidates = p.querySelectorAll('.post-content')).length === 1) {
            p = p_candidates[0];
        } else if ((p_candidates = p.querySelectorAll('.main-content')).length === 1) {
            p = p_candidates[0];
        }
    }
    initialize(p);
    /* event listeners */
    window.addEventListener('load', function () {
        progress(p);
    });
    window.addEventListener('scroll', function () {
        progress(p);
    }, {passive: true});
    window.addEventListener('resize', function () {
        clearTimeout(tt);
        tt = setTimeout(function () {
            initialize(p);
        }, 372); // debounce / throttle resize event
    });

    function initialize(p) {
        const adminbar = document.getElementById('wpadminbar');
        let el;
        windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if (typeof ruigehond006_c.mark_it_zero !== 'undefined') {
            heightCorrection = Math.max(windowHeight - (boundingClientTop(p) + window.pageYOffset), 0); // math.max for when article is off screen
        }
        fromTop = (adminbar !== null && window.getComputedStyle(adminbar).getPropertyValue('position') === 'fixed')
            ? adminbar.offsetHeight : 0;
        if (!document.getElementById('ruigehond006_bar')) {
            document.body.insertAdjacentHTML('beforeend',
                '<div id="ruigehond006_wrap"><div id="ruigehond006_inner"><div id="ruigehond006_bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="-1"></div></div></div>');
            el = document.getElementById('ruigehond006_bar');
            el.style.backgroundColor = ruigehond006_c.bar_color;
            if (ruigehond006_c.hasOwnProperty('aria_label')) el.setAttribute('aria-label', ruigehond006_c.aria_label);
            if (ruigehond006_c.bar_attach === 'bottom') {
                document.getElementById('ruigehond006_wrap').style.bottom = '0';
                document.getElementById('ruigehond006_inner').style.bottom = '0';
            }
        }
        progress(p);
        setTimeout(function () {
            progress(p);
            if (!document.getElementById('ruigehond006_inner').style.height) {
                requestAnimationFrame(function () {
                    document.getElementById('ruigehond006_inner').style.height = ruigehond006_c.bar_height;
                });
            }
        }, 502); // TODO this is not cool, but you have to wait for reflow to position the bar
    }

    function progress(p) {
        const loc_height = p.scrollHeight - heightCorrection, // height in pixels = total amount that can be read
            reading_done = Math.max(Math.min(100 * (windowHeight - boundingClientTop(p) - heightCorrection) / loc_height, 100), 0);
        requestAnimationFrame(function () {
            const el = document.getElementById('ruigehond006_bar');
            el.style.width = reading_done + '%';
            el.setAttribute('aria-valuenow', Math.trunc(reading_done).toString());
            if (ruigehond006_c.bar_attach !== 'bottom') barInDom();
        });
    }

    function barInDom() {
        const wrap = document.getElementById('ruigehond006_wrap'),
            inner = document.getElementById('ruigehond006_inner');
        //if (ruigehond006_c.bar_attach === 'bottom') return; // this function should not be called in that case at all to avoid overhead
        if ((ruigehond006_a = getAttacher())) { // it can disappear so you need to check every time
            requestAnimationFrame(function () {
                let top, new_margin, old_margin;
                if (!ruigehond006_a.querySelector('#ruigehond006_wrap')) {
                    if (typeof ruigehond006_c.stick_relative !== 'undefined') {
                        wrap.style.position = 'relative';
                    } else {
                        wrap.style.position = 'absolute';
                        wrap.style.top = 'inherit';
                    }
                    ruigehond006_a.insertAdjacentElement('beforeend', wrap); // always attach as a child to ensure smooth operation
                }
                // make sure it’s always snug against the element using top margin
                top = ruigehond006_a.offsetHeight + fromTop + boundingClientTop(ruigehond006_a);
                new_margin = (old_margin = (parseFloat(inner.style.marginTop) || 0)) + top - fromTop - boundingClientTop(inner);
                if (new_margin !== old_margin) {
                    inner.style.marginTop = new_margin.toString() + 'px';
                    //console.warn('set margin from ' + old_margin + ' to ' + new_margin);
                }
                //console.warn(top + ' vs ' + boundingClientTop(inner) + ' vs ' + inner.getBoundingClientRect().top);
            });
        } else { // bar_attach must be top
            barToTop(wrap, inner);
        }
    }

    function getAttacher() {
        let nodes, nodes_len, nodes_i, selector, element, i, len, h;
        if (0 === a_candidates.length) {
            const selectors = ruigehond006_c.bar_attach.split(',');
            for (i = 0, len = selectors.length; i < len; ++i) {
                selector = selectors[i].trim();
                if (0 === selector.indexOf('#') && -1 === selector.indexOf(' ')) {
                    a_candidates.push(document.getElementById(selector.substr(1)));
                } else if ((nodes = document.querySelectorAll(selector))) {
                    for (nodes_i = 0, nodes_len = nodes.length; nodes_i < nodes_len; ++nodes_i) {
                        a_candidates.push(nodes[nodes_i]);
                    }
                }
            }
        }
        for (i = 0, len = a_candidates.length; i < len; ++i) {
            if (!(element = a_candidates[i])) continue;
            h = element.offsetHeight;
            // return this element if it is visible and the bottom of it is still in the viewport
            if (
                !!(h || element.offsetWidth || element.getClientRects().length)
                && (h = h + boundingClientTop(element)) > 0 && h < windowHeight - fromTop
            ) {
                return element;
            }
        }
        return null;
    }

    /**
     *  On older iPads (at least iOS 8 + 9) the getBoundingClientRect() gets migrated all the way outside the
     *  viewport inconsistently while scrolling with touch, so we roll our own function
     */
    function boundingClientTop(el) {
        let elementTop = 0;
        const scrollTop = window.pageYOffset;
        while (el) {
            elementTop += el.offsetTop;
            if (scrollTop > 0
                && ('fixed' === (el.style.position.toLowerCase()
                    || window.getComputedStyle(el).getPropertyValue('position').toLowerCase()))) {
                return elementTop;
            }
            el = el.offsetParent; // this is either null for body, or maybe a fixed element, but we returned early then
        }
        return elementTop - scrollTop;
    }

    function barToTop(wrap, inner) {
        if (document.body === wrap.parentElement && 'fixed' === wrap.style.position) return; // already on top
        requestAnimationFrame(function () {
            wrap.style.position = 'fixed';
            wrap.style.top = fromTop + 'px';
            inner.style.marginTop = '0';
            document.body.insertAdjacentElement('beforeend', wrap);
        });
    }
}

/* only after everything is locked and loaded we’re initialising the progress bar */
if (document.readyState === 'complete') {
    setTimeout(ruigehond006, 351);
} else {
    window.addEventListener('load', function () {
        setTimeout(ruigehond006, 351);
    });
}
