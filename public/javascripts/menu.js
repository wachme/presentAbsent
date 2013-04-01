Menu = {};

Menu.move = function(pos) {
    Menu.indicator.clearQueue().animate({
        top : pos.top,
        left : pos.left
    }, 300);
};

Menu.activeOffset = function() {
    return $('.menu a[href="' + window.location.pathname + '"]').offset();
};

Menu.init = function() {
    var ind = $('<div class="indicator">');
    ind.width($('.menu a').outerWidth());
    ind.height($('.menu a').outerHeight());
    ind.offset(Menu.activeOffset());
    $('body').append(ind);
    Menu.indicator = ind;
    $('.menu a').mouseover(function() {
        Menu.move($(this).offset())
    });
    $('.menu').mouseout(function(e) {
        if(!$(e.toElement).parents().filter('.menu').size()) {
            Menu.move(Menu.activeOffset());
        }
    });
};

$(Menu.init);
