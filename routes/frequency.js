var Analyzer = require('../lib/analyzer');

function render(req, res, start, end) {
    req.schedule(function(schedule) {
        req.attendance(function(att) {
            if(!!start) {
                start = new Date(start);
                start.setHours(0);
            }
            if(!!end) {
                end = new Date(end);
                end.setHours(0);
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
                message : message
            });
        });
    });
};

exports.index = function(req, res) {
    render(req, res);
};

exports.indexPost = function(req, res) {
    render(req, res, req.body.start, req.body.end);
};
