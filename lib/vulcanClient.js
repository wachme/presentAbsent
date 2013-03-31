var utils = require('./utils'), HttpClient = require('./httpClient');

Attendance = function(data) {
    for (var i = 0; i < data.length; this.push(data[i++]));
};

Attendance.prototype = [];

Attendance.prototype.__defineGetter__('start', function() {
    return this[0].date;
});

Attendance.prototype.__defineGetter__('end', function() {
    return this[this.length - 1].date;
});

Attendance.prototype.period = function(start, end) {
    data = [];
    for (var i = 0; i < this.length; i++) {
        if (((start && this[i].date >= start) || !start) && ((end && this[i].date <= end) || !end)) {
            data.push(this[i]);
        }
    }
    return new Attendance(data);
};

VulcanClient = function(license, host) {
    this.license = license;
    this.client = new HttpClient(host || 'aplikacje.vulcan.pl');
    this.client.prefix = '/dziennik/' + license;
    this.absentSigns = {
        'u' : 'u',
        'ns' : 'ns',
        '-' : '-'
    };
};

VulcanClient.prototype.present = function(info) {
    for (key in this.absentSigns) {
        if (info.indexOf(key) >= 0) {
            return this.absentSigns[key];
        }
    }
    return true;
}

VulcanClient.prototype.login = function(login, password, callback) {
    var client = this.client;
    client.request('/logowanie.aspx', function(data) {
        try {
            var form = {
                '__EVENTTARGET' : 'lnkbt_logon',
                '__EVENTARGUMENT' : '',
                '__VIEWSTATE' : data.match(/id\=\"__VIEWSTATE\" value\=\"(.*?)\"/)[1],
                '__EVENTVALIDATION' : data.match(/id\=\"__EVENTVALIDATION\" value\=\"(.*?)\"/)[1],
                'txtUserName' : login,
                'txtPwd' : password
            };
            client.request('/logowanie.aspx', null, form, function(data) {
                callback(data.indexOf('Dzienniczek ucznia Optivum - okno logowania') < 0);
            });
        } catch(e) {
            callback(false);
        };
    });
};

VulcanClient.prototype.__defineGetter__('userContext', function() {
    return this.client.cookies['USERCONTEXT'];
});

VulcanClient.prototype.__defineSetter__('userContext', function(value) {
    this.client.cookies['USERCONTEXT'] = value;
});

VulcanClient.prototype.attendance = function(callback) {
    var self = this;
    this.client.request('/dzienniczek.aspx?view=Frekwencja', function(content) {
        var table = content.match(/tabelka_dane(.*?)\<\/TABLE\>/)[1];
        var data = [];
        utils.matchAll(/\<TR (.*?)\<\/TR\>/g, table, function(row, n) {
            if (n == 0)
                return;
            row = row[1];
            var date = row.match(/\;(\d\d)\-(\d\d)\-(\d\d\d\d)\,/);
            date = new Date(parseInt(date[3], 10), parseInt(date[2], 10) - 1, parseInt(date[1], 10));
            var day = {
                date : date,
                lessons : []
            };
            data.push(day);

            utils.matchAll(/\<TD .*?\>(.*?)\<\/TD\>/g, row, function(info, n) {
                if (n == 0)
                    return;
                info = info[1];
                day.lessons.push(self.present(info));
            });
        }, function() {
            callback(new Attendance(data));
        });
    });
};

module.exports = VulcanClient;
