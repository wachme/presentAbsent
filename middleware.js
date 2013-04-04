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

        req.user = {
            name : 'wackar07612',
            license : '00088',
            userContext : 'E7ccaQ0x27RmMup2rQ7eXLw2tsl3BB0YpKZKOv%2fjpCv5psBOTcgxu%2bvQtE6MhOXa0thdhVhSm7CN1FInb5s5GTVlkRqGynJBacLohcM%2b9sLtgupFYeDpgqqpqJQDH62yRY1HZazJIohAiHv2P3Suq8y2zLrL6ygeKJGf1HeyHbipXUYZAtHpnsMf6LnFxq6us0yKu%2fPQCi%2bjtMHE530Kcu4x6nneRKalPVOdoJr5YECqn2eqNAtHSBe5iPM3eXrwaBFlptqdfd6jtOFUpg4Ge7wCR1cJJ%2bEMgmw5biz8Sf%2b%2fW5vZthnu%2ff6ZvEoxDZjf47WAunQkZEsfPjsa4FH%2fPtKQiV7pt7eJ6XQjIWz8m00kiXANjrA69vnUZJptO7XfRjwU3co%2b7%2ffVHhhwuTivj7E0swZfMsn%2bajljculmUCOs5QLZfveu2gTvU9tjR4H%2f3Ksshq15NlWBSSNC5t7abYx8XHoIV3tBPQt4DNe9WjiJ30MCXs%2f66pZmpxdqLiXIbU4ncEGyNzcoIJcWcP2CIkBcTpRscDWAgCZDnxM0g1F0TxNjxjlCNv%2fyM0NZn5mltDARe%2fhGJQ8MHod5oZ4n9oKfVsYGdJyGLcoKFsEwfYVlP981HPdFW7%2bn7xHBj2fAAIDVNYEagYXtzQelnTzwPYJLXTSlqMypY5%2fIA7wWZptp2btu6m5UiQEwWvUDkFAPFtSLFpAkNvmrrY3dOZlTgik8u9lx2z5y%2ftcsboMw%2f69hgSqEEVnEpKE3J6QR9ruqKCbPYK5qF%2bdD0f7HJ2QR8oqq8vCeHPBdyIVmzCZTRDYu6aXZFInJQzcWUY0ZMCZ8tvMfK5DPV0t0p2dX6pwLS6kAZVI1NJAlIi8L4BsuBqsiT5M8KZUi3l1c%2fncViUE6X0LfEPpHQwjAaIAcNt9ZnxoHdZFbhnLayOfGPmH3hALVU3G1ocKVRkE0F0foGGLc7nedkVE2mq195tKsZ%2ff6J3kdcZH8KWvPJ9xFvgtnSyEdYGIMc9tSutWV%2fGC2NJ3M',
            className : '3TC',
            schedule : new Schedule([[null, {
                name : 'j.pol',
                group : null
            }, {
                name : 'j.pol',
                group : null
            }, {
                name : 'religia',
                group : null
            }, {
                name : 'utk',
                group : null
            }, {
                name : 'prog.str.',
                group : null
            }, {
                name : 'mat',
                group : null
            }, {
                name : 'soisk',
                group : '2/2'
            }, {
                name : 'soisk',
                group : '2/2'
            }, null], [{
                name : 'wf',
                group : '#C31'
            }, {
                name : 'wf',
                group : '#C31'
            }, null, {
                name : 'utk',
                group : null
            }, {
                name : 'j.ang',
                group : '#T35'
            }, {
                name : 'soisk',
                group : null
            }, {
                name : 'j.niem',
                group : '#N32'
            }, {
                name : 'j.niem',
                group : '#N32'
            }, null, null], [null, null, {
                name : 'wf',
                group : '#C31'
            }, {
                name : 'gw',
                group : null
            }, {
                name : 'prog.str.',
                group : '2/2'
            }, {
                name : 'prog.str.',
                group : '2/2'
            }, {
                name : 'ob',
                group : '2/2'
            }, {
                name : 'ob',
                group : '2/2'
            }, null, null], [null, {
                name : 'aplikacje/s',
                group : '2/2'
            }, {
                name : 'aplikacje/s',
                group : '2/2'
            }, {
                name : 'j.pol',
                group : null
            }, {
                name : 'utk',
                group : null
            }, {
                name : 'aplikacje/s',
                group : null
            }, {
                name : 'soisk',
                group : null
            }, {
                name : 'hist',
                group : null
            }, {
                name : 'p.prze',
                group : null
            }, null], [{
                name : 'soisk',
                group : '2/2'
            }, {
                name : 'fiz.i a',
                group : null
            }, {
                name : 'j.pol',
                group : null
            }, {
                name : 'mat',
                group : null
            }, {
                name : 'ob',
                group : '2/2'
            }, {
                name : 'ob',
                group : '2/2'
            }, {
                name : 'j.ang',
                group : '#T35'
            }, {
                name : 'p.prze',
                group : null
            }, {
                name : 'religia',
                group : null
            }, null]])
        };
        next();
        return;

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
