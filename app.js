var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon'); // Uncomment if favicon is used
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var serverStatus = require('express-status-monitor')();

// Routes
var index = require('./routes/index');
var swap = require('./routes/swap');
var rates = require('./routes/rates');
var orders = require('./routes/orders');
var supportedCoins = require('./routes/supported_coins');
var admin = require('./routes/admin');

var app = express();

// Optional debug routes
var debug;
if (process.env.DEBUG_ROUTES) {
    debug = require('./routes/debug');
}

// TODO: Move to a separate app, this is here only to speed up development.
// var chainHandlers = require('./blockchains/chains.js'); // Uncomment if used
// var rateController = require('./controllers/ratesController'); // Uncomment if used

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // Uncomment if favicon is used
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/', index);
app.use('/swap', swap);
app.use('/rates', rates);
app.use('/orders', orders);
app.use('/supported_coins', supportedCoins);
app.use('/admin', admin);
app.use(serverStatus);

// Optional debug route
if (process.env.DEBUG_ROUTES) {
    app.use('/debug', debug);
}

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
