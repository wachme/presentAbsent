var Analyzer = require('../lib/analyzer');

function render(req, res, start, end, removeSubjects) {
    req.schedule(function(schedule) {
        req.attendance(function(att) {
            if (!!start) {
                start = new Date(start);
                start.setHours(0);
            }
            if (!!end) {
                end = new Date(end);
                end.setHours(0);
            }
            if (removeSubjects) {
                var subjects = schedule.subjects;
                for (var i = 0; i < removeSubjects.length; subjects.remove(removeSubjects[i++]));
                schedule = schedule.reduce(subjects);
            }
            var analyzer = new Analyzer(schedule, att.period(start, end));
            var days = [], frequency = [], message;
            try {
                days = analyzer.days;
                frequency = analyzer.frequency;
            } catch(err) {
                message = 'W planie lekcji wystąpił błąd! <a href="/schedule">Popraw ustawienia</a>';
            }
            res.render((req.get('X-Requested-With') ? 'includes/frequency' : 'frequency'), {
                days : analyzer.days,
                frequency : analyzer.frequency,
                subjects : schedule.subjects,
                message : message
            });
        });
    });
};

exports.index = function(req, res) {
    render(req, res);
};

exports.indexPost = function(req, res) {
    render(req, res, req.body.start, req.body.end, req.body.removeSubjects);
};
