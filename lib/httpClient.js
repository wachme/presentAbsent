var http = require('http');
var utils = require('./utils');

HttpClient = function(host) {
    this.host = host;
    this.cookies = {};
    this.prefix = '';
};

HttpClient.prototype.request = function(path, headers, data, callback) {
    path = this.prefix + path;
    if (!data && !callback && typeof headers == 'function') {
        callback = headers;
        headers = undefined;
    } else if (!callback && typeof data == 'function') {
        callback = data;
        data = undefined;
    }
    var options = {
        host : this.host,
        port : 80,
        path : path,
        method : data ? 'POST' : 'GET',
        headers : {
            "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0",
            Connection : "keep-alive",
            Accept : "text/html, text/javascript, application/json, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
        }
    };

    var cookies = "";
    for (var key in this.cookies) {
        cookies += key + (this.cookies[key] ? "=" + this.cookies[key] : "") + "; ";
    }

    options.headers['Cookie'] = cookies;

    if (headers) {
        for (key in headers) {
            options.headers[key] = headers[key];
        }
    }
    
    if(data) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    var cookies = this.cookies;
    var req = http.request(options, function(response) {
        var rawCookie = response.headers["set-cookie"];
        if (rawCookie) {
            rawCookie.forEach(function(line) {
                if(line) {
                    line = line.split(';')[0];
                    var assign = line.indexOf('=');
                    cookies[line.substring(0, assign).trim()] = line.substring(assign + 1);
                }
            });
        }
        var data = '';
        response.on('data', function(chunk) {
            data += chunk;
        });

        response.on('end', function() {
            callback(data, response);
        });
    });
    if (data) {
        req.write(( typeof data == 'object' ? utils.params(data) : data));
    }

    req.end();
};

module.exports = HttpClient;
