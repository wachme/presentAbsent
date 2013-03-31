var utils = require('./utils'), HttpClient = require('./httpClient');

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

ScheduleClient = function(host) {
    this.client = new HttpClient(host || 'zsk.poznan.pl');
    this.client.prefix = '/plan';
};

ScheduleClient.prototype._loadClasses = function(callback) {
    this._classes = {};
    var self = this;
    this.client.request('/lista.html', function(content) {
        utils.matchAll(/href\=\"(plany\/o.*?\.html)\" target\=\"plan\"\>(.*?)\<\/a>/g, content, function(item) {
            self._classes[item[2].toUpperCase()] = item[1];
        }, function() {
            callback();
        });
    });
};

ScheduleClient.prototype.classes = function(callback) {
    var self = this;
    function mapClasses() {
        var list = [];
        for (key in self._classes) {
            list.push(key);
        }
        return list;
    }

    if (this._classes) {
        callback(mapClasses());
    } else {
        this._loadClasses(function() {
            callback(mapClasses());
        });
    }
};

ScheduleClient.prototype.schedule = function(className, callback) {
    var self = this;
    if (!this._classes) {
        this._loadClasses(function() {
            self.schedule(className, callback);
        });
        return;
    }
    this.client.request('/' + this._classes[className.toUpperCase()], function(content) {
        var schedule = [];
        for (var i = 0; i < 5; schedule[i++] = []);
        content = content.replace(/(\r\n|\n|\r)/gm, '');
        utils.matchAll(/\<tr\>\s*\<td class\=\"nr\"\>(.)\<\/td\>\s*\<td class\=\"g\">.*?\<\/td\>(.*?)\<\/tr\>/g, content, function(cell) {
            var lessonN = cell[1];
            utils.matchAll(/\<td class\=\"l\">(.*?)\<\/td\>/g, cell[2], function(l, dayN) {
                schedule[dayN][lessonN] = [];
                l[1].split('<br>').forEach(function(item, groupN) {
                    utils.matchAll(/\<span class\=\"p\"\>(.*?)\<\/span\>/g, item, function(lesson, n) {
                        lesson = lesson[1];
                        if (n == 0) {
                            var group = lesson.match(/\-(\d+\/\d+)$/);
                            if (group) {
                                schedule[dayN][lessonN].push({
                                    name : lesson.substring(0, group.index),
                                    group : group[1]
                                });
                            } else {
                                schedule[dayN][lessonN].push({
                                    name : lesson,
                                    group : null
                                });
                            }
                        } else if (n == 1) {
                            schedule[dayN][lessonN][groupN].group = lesson;
                        }
                    });
                });
                var len = schedule[dayN][lessonN].length;
                if (len == 1) {
                    schedule[dayN][lessonN] = schedule[dayN][lessonN][0];
                } else if (len == 0) {
                    schedule[dayN][lessonN] = null;
                }
            });
        }, function() {
            callback(new Schedule(schedule));
        });
    });
}

module.exports = ScheduleClient;
