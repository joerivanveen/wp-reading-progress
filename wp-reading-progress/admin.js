jQuery(document).ready(function ($) {
    try {
        $(".ruigehond006_colorpicker").wpColorPicker();
    } catch(e) {
        console.error(e);
    }
    $('.ruigehond006.explanation a').on('click', function () {
        $(this).parents('td').find('input').val(this.innerHTML);
    }).css({'cursor': 'pointer'});
});
