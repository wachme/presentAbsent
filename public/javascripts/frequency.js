Frequency = {};

Frequency.init = function() {
    $('.bar').click(function() {
        $this = $(this);
        var next = $this.next();
        if (next.is(':visible')) {
            next.fadeOut('fast', function() {
                $this.css('background-image', 'url(\'../images/toggle_plus.png\')');
            });
        } else {
            next.fadeIn(function() {
                $this.css('background-image', 'url(\'../images/toggle_minus.png\')');
            });
        }
    });
    $('#start, #end').change(Frequency.load);
    var timer;
    $('.subjects-bar, .subjects').hover(function() {
        clearTimeout(timer);
        $('.subjects').fadeIn();
    }, function() {
        timer = setTimeout(function() {
            $('.subjects').clearQueue().fadeOut('fast');
        }, 200);
    });
    $('.subjects #all').change(function() {
        $('.subjects :checkbox').prop('checked', $(this).is(':checked'));
    });
    $('.subjects :checkbox').change(Frequency.load);
};

Frequency.load = function() {
    $.post('#', {
        start : $('#start').val(),
        end : $('#end').val(),
        removeSubjects : $('.subjects :checkbox:not(#all)').map(function(i, el) {
            $el = $(el);
            return !$el.is(':checked') && $el.val() || undefined;
        }).toArray()
    }, ajaxLoader(function(data) {
        $data = $(data);
        $('.days').html($data.filter('.days').html());
        $('.frequency').html($data.filter('.frequency').html());
        $('.stats').html($data.filter('.stats').html());
    }));
};

Frequency.drawChart = function() {
    
};

$(Frequency.init);
