Frequency = {};

Frequency.init = function() {
    $('.bar').click(function() {
        $this = $(this);
        var next = $this.next();
        if (next.is(':visible')) {
            next.fadeOut(function() {
                $this.css('background-image', 'url(\'../images/toggle_plus.png\')');
            });
        } else {
            next.fadeIn(function() {
                $this.css('background-image', 'url(\'../images/toggle_minus.png\')');
            });
        }
    });
    $('#start, #end').change(Frequency.load);
};

Frequency.load = function() {
    $.post('#', {
        start: $('#start').val(),
        end: $('#end').val()
    }, ajaxLoader(function(data) {
        $data = $(data);
        $('.days').html($data.filter('.days').html());
        $('.frequency').html($data.filter('.frequency').html());
    }));
};

$(Frequency.init);
