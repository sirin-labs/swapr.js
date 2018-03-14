var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var serverStatus = require('express-status-monitor')()

// Routes
var index = require('./routes/index');
var swap = require('./routes/swap');
var rates = require('./routes/rates');
var orders = require('./routes/orders');
var supported_coins = require('./routes/supported_coins');
var admin = require('./routes/admin');

if (process.env.DEBUG_ROUTES)
    var debug = require('./routes/debug');

// TODO: Move to a separate app, this is here only to speed up development.
var chain_handlers = require('./blockchains/chains.js')
var rate_controller = require('./controllers/ratesController')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/swap', swap);
app.use('/rates', rates);
app.use('/orders', orders);
app.use('/supported_coins', supported_coins);
app.use(serverStatus)
app.use('/admin', admin);

if (process.env.DEBUG_ROUTES) {
    app.use('/debug', debug);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
