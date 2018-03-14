var debug = require('debug')('swapr:swap');
var express = require('express');
var router = express.Router();

var db = require('../db/db_repo.js');

// DB schemes in use
var supported_coins_book = db.supported_coins_book;

// A route used to query current open orders
router.get('/', function(req, res, next) {
    var coins_arr = [];
    for (var key of supported_coins_book.keys()) {
        coins_arr.push(key);
    }

    res.json(coins_arr);
});

module.exports = router;
