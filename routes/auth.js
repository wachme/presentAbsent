var ScheduleClient = require('../lib/scheduleClient'), VulcanClient = require('../lib/vulcanClient');

function render(res, message) {
    var sc = new ScheduleClient();
    sc.classes(function(classes) {
        res.render('login', {
            classes : classes,
            message : message
        });
    });
}

exports.login = function(req, res) {
    render(res);
};

exports.loginPost = function(req, res) {
    var vc = new VulcanClient(req.body.license);
    vc.login(req.body.login, req.body.password, function(result, err) {
        if (result) {
            req.user.fill({
                name : req.body.login,
                license : req.body.license,
                userContext : vc.userContext,
                className : req.body.className
            });
            res.redirect('/schedule');
        } else {
            render(res, 'Niepoprawne dane!');
        }
    });
};

exports.logout = function(req, res) {
    req.user.remove();
    res.redirect('/');
};
