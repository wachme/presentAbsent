var ScheduleClient = require('./lib/scheduleClient'), VulcanClient = require('./lib/vulcanClient'), Analyzer = require('./lib/analyzer'), crypto = require('crypto');

Schedule = function(data) {
    for (var i = 0; i < data.length; this.push(data[i++]));
};

Schedule.prototype = [];

Schedule.prototype.eachLesson = function(arrayOnly, ignoreNull, callback) {
    callback = arguments[arguments.length - 1];
    for (var i = 0; i < this.length; i++) {
        var day = this[i];
        for (var j = 0; j < day.length; j++) {
            if (ignoreNull && day[j] == null) {
                continue;
            }
            callback((arrayOnly && (!day[j] || day[j].constructor != Array)) ? [day[j]] : day[j], i, j);
        }
    }
};

Schedule.prototype.__defineGetter__('subjects', function() {
    var subjects = [];
    subjects.indexOf = function(element) {
        for (var i = 0; i < this.length; i++) {
            if (element.name == undefined) {
                if (this[i].name == element) {
                    return i;
                }
            } else if (this[i].name == element.name && this[i].groups.indexOf(element.group) > -1) {
                return i;
            }
        }
        return -1;
    };
    subjects.find = function(element) {
        return this[this.indexOf(element)];
    };
    subjects.remove = function(element) {
        var index = this.indexOf(element);
        if (index > -1) {
            if (element.name == undefined) {
                this.splice(index, 1);
            } else {
                var groups = this[index].groups;
                groups.splice(groups.indexOf(element.group), 1);
            }
        }
    };

    this.eachLesson(true, true, function(lesson, i, j) {
        for (var i = 0; i < lesson.length; i++) {
            var subj = subjects.find(lesson[i].name);
            if (!subj) {
                subjects.push({
                    name : lesson[i].name,
                    groups : [lesson[i].group]
                });
            } else if (subj.groups.indexOf(lesson[i].group) == -1) {
                subj.groups.push(lesson[i].group);
            }
        }
    });
    return subjects;
});

Schedule.prototype.reduce = function(subjects) {
    var self = this;
    var data = [];
    this.eachLesson(true, false, function(lesson, i, j) {
        data[i] || data.push([]);
        var added = [];
        for (var k = 0; k < lesson.length; k++) {
            if (lesson[k] == null || subjects.find(lesson[k])) {
                added.push(lesson[k]);
            }
        }
        if (added.length == 0) {
            data[i].push(null);
        } else if (added.length == 1) {
            data[i].push(added[0]);
        } else {
            data[i].push(added);
        }
    });
    return new Schedule(data);
};

exports.userStorage = function(params) {
    var users = {};
    return function(req, res, next) {
        for (i in users) {
            if (users[i].expires < new Date()) {
                delete users[i];
            }
        }
        var id = req.cookies.userId;
        if (!users[id]) {
            id = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
            users[id] = {
                data : {
                    remove : function() {
                        delete users[id];
                    },
                    fill : function(data) {
                        for (i in data) {
                            this[i] = data[i];
                        }
                    }
                },
                expires : new Date()
            };
            res.cookie('userId', id);
        }
        users[id].expires.setMinutes(new Date().getMinutes() + (params && params.lifetime || 30));
        req.user = users[id].data;
        next();
    };
};

exports.context = function(req, res, next) {
    var user = req.user;
    if (!user.name) {
        res.redirect('/login');
    } else {
        req.scheduleClient = function() {
            if (!this._scheduleClient) {
                this._scheduleClient = new ScheduleClient();
            }
            return this._scheduleClient;
        };
        req.schedule = function(callback) {
            if (user.schedule) {
                callback(user.schedule);
            } else {
                this.scheduleClient().schedule(user.className, function(s) {
                    user.schedule = s;
                    callback(user.schedule);
                });
            }
        };
        req.vulcanClient = function() {
            if (!this._vulcanClient) {
                this._vulcanClient = new VulcanClient(user.license);
                this._vulcanClient.userContext = user.userContext;
            }
            return this._vulcanClient;
        };
        req.attendance = function(callback) {
            if (user.attendance) {
                callback(user.attendance);
            } else {
                this.vulcanClient().attendance(function(att) {
                    user.attendance = att;
                    callback(user.attendance);
                });
            }
        };
        next();
    }
};
