function render(req, res) {
    req.schedule(function(schedule) {
        res.render((req.get('X-Requested-With') ? 'includes/schedule' : 'schedule'), {
            className : req.user.className,
            schedule : schedule,
        });
    });

}

exports.subjects = function(req, res) {
    render(req, res);
};

exports.subjectsPost = function(req, res) {
    req.schedule(function(schedule) {
        var subjects = schedule.subjects;
        if (req.body.reset) {
            req.scheduleClient().schedule(req.user.className, function(schedule) {
                req.user.schedule = schedule;
                render(req, res);
            });
        } else {
            if (req.body.groups) {
                for (var i = 0, groups = req.body.groups; i < groups.length; i++) {
                    subjects.find(groups[i].name).groups = [null, groups[i].group];
                }
            }
            if (req.body.remove) {
                for (var i = 0; i < req.body.remove.length; subjects.remove(req.body.remove[i++]));
            }
            req.user.schedule = schedule.reduce(subjects);
            render(req, res);
        }
    });
};
