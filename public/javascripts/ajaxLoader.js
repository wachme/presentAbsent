function ajaxLoader(callback) {
    if (!$('.loader').size()) {
        var loader = $('<div class="loader"></div>');
        loader.prependTo('body');
        var $window = $(window);
        loader.offset({
            top : ($window.height() - loader.height()) / 2 + $window.scrollTop(),
            left : ($window.width() - loader.width()) / 2
        }).hide();
        setTimeout(function() {
            loader.show();
        }, 200);
    }
    return function() {
        loader.remove();
        callback.apply(this, arguments);
    }
}
