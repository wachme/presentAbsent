var Analyzer = require('../lib/analyzer');

exports.index = function(req, res) {
    req.schedule(function(schedule) {
        req.attendance(function(att) {
            var analyzer = new Analyzer(schedule, att);
            res.render('index', {
                days : analyzer.days
            });
        });
    });
};
