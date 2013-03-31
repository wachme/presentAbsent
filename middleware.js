var ScheduleClient = require('./lib/scheduleClient'), VulcanClient = require('./lib/vulcanClient'), Analyzer = require('./lib/analyzer'), crypto = require('crypto');

exports.userStorage = function(params) {
    var users = {};
    return function(req, res, next) {
        for(i in users) {
            if(users[i].expires < new Date()) {
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
                expires: new Date()
            };
            res.cookie('userId', id);
        }
        users[id].expires.setMinutes(new Date().getMinutes() + (params && params.lifetime || 20));
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
                this.scheduleClient().schedule(user.className, function(schedule) {
                    user.schedule = schedule;
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
            if(user.attendance) {
                callback(user.attendance);
            }
            else {
                this.vulcanClient().attendance(function(att) {
                    user.attendance = att;
                    callback(user.attendance);
                });
            }
        };
        
        next();
    }
};
