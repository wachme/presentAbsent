Analyzer = function(schedule, attendance) {
    this.schedule = schedule;
    this.attendance = attendance;
};

Analyzer.prototype.__defineGetter__('days', function() {
    if (!this._days) {
        this._days = [];
        for (var i = 0; i < this.attendance.length; i++) {
            var att = this.attendance[i];
            var dayN = att.date.getDay() - 1;
            var plan = this.schedule[dayN];
            var day = {
                date : att.date,
                lessons : []
            };
            for (var j = 0; j < att.lessons.length; j++) {
                if (plan[j] && plan[j].constructor == Array) {
                    throw {
                        day : dayN,
                        lesson : j,
                        data : plan[j]
                    };
                }
                day.lessons.push(plan[j] ? {
                    lesson : plan[j],
                    present : att.lessons[j]
                } : null);
            }
            this._days.push(day);
        }
    }
    return this._days;
});

Analyzer.prototype.__defineGetter__('frequency', function() {
    var days = this.days;
    var subjects = {};
    function subject(lesson) {
        if (lesson == null) {
            return;
        }
        if (!subjects[lesson.lesson.name]) {
            subjects[lesson.lesson.name] = {
                all : 0
            };
        }
        var subject = subjects[lesson.lesson.name];
        var present = (lesson.present === true) ? 'present' : lesson.present;
        if (subject[present] == undefined) {
            subject[present] = 0;
        }
        subject[present]++;
        subject.all++;
    }

    for (var i = 0; i < days.length; i++) {
        var day = days[i];
        for (var j = 0; j < day.lessons.length; j++) {
            var lesson = day.lessons[j];
            subject(lesson);
            if (lesson) {
                subject({
                    lesson : {
                        name : 'overall'
                    },
                    present : lesson.present
                });
            }
        }
    }
    return subjects;
});

Analyzer.prototype.average = function(period) {
    
};

module.exports = Analyzer;
