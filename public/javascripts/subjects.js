Subjects = {};

Subjects.initForm = function() {
    Subjects.form = {
        remove : [],
        groups : []
    };
}

Subjects.remove = function(el) {
    $el = $(el);
    var group = $el.find('.group').text();
    Subjects.form.remove.push(!!group ? {
        name : $el.find('.name').text(),
        group : group
    } : $el.find('.name').text());
};

Subjects.init = function() {
    Subjects.initForm();
    $('.schedule .reset').click(function() {
        Subjects.form.reset = true;
        Subjects.submit();
    });
    $('.schedule .remove').click(function(el) {
        $this = $(this);
        $this.parent().find('.lesson').each(function(i, el) {
            Subjects.remove(el);
        });
        Subjects.submit();
    });
    $('.schedule td').each(function(i, el) {
        $el = $(el);
        if ($el.find('.lesson').size() > 1) {
            $el.find('.lesson').hover(function() {
                $(this).addClass('active-lesson');
            }, function() {
                $(this).removeClass('active-lesson');
            }).click(function() {
                $this = $(this);
                var self = this;
                $this.parent().find('.lesson').each(function(i, el) {
                    if (el != self) {
                        Subjects.remove(el);
                    }
                });
                Subjects.form.groups.push({
                    name : $this.find('.name').text(),
                    group : $this.find('.group').text()
                });
                Subjects.submit();
            });
        }
    });
};

Subjects.submit = function() {
    $.post('#', Subjects.form, ajaxLoader(function(data) {
        $('.schedule').html(data);
        Subjects.init();
    }));
};

$(Subjects.init);
