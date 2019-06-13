if (document.readyState !== 'loading') {
    ruigehond006_start();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        ruigehond006_start();
    });
}

function ruigehond006_start() {
    (function ($) {
        $p = $('article.post');
        if ($p.length === 1) {
            let p = $p[0];
            $('body').append('<div class="ruigehond006 progress"><div class="bar"></div></div>');
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
