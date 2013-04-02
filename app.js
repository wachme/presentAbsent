/**
 * Module dependencies.
 */

var express = require('express'), frequency = require('./routes/frequency'), auth = require('./routes/auth'), schedule = require('./routes/schedule'), http = require('http'), path = require('path'), middle = require('./middleware');

var app = express();

app.set('env', 'development');

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({
        src : __dirname + '/public'
    }));
    app.use(express.cookieParser('gfdg7fdg9e85rgm768yhmg45w73t8hf2wehbdnvg'));
    app.use(middle.userStorage());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('production', function() {
    app.set('port', process.env.VMC_APP_PORT || 1337);  
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/', middle.context, frequency.index);
app.post('/', middle.context, frequency.indexPost)

app.get('/login', auth.login);
app.post('/login', auth.loginPost);
app.get('/logout', auth.logout);

app.get('/schedule', middle.context, schedule.subjects);
app.post('/schedule', middle.context, schedule.subjectsPost)

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
