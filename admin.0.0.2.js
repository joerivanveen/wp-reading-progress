jQuery(document).ready(function ($) {
    $("[name='ruigehond006[bar_color]']").wpColorPicker();
    $('.ruigehond006.explanation a').on('click', function () {
        $(this).parents('td').find('input').val(this.innerHTML);
    });
    $('.ruigehond006.explanation a').css({'cursor': 'pointer'});
});
