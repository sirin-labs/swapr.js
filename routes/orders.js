var debug = require('debug')('swapr:swap');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../db/db_repo');

const order_book = db.OrderBookDao;

// A route used to query current open orders
router.get('/', function(req, res, next) {
    order_book.find({})
        .then(orders => {
            res.json(orders);
        }).catch(err => res.status(500));
});

// A route used to query a specific order
router.get('/:id', function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    dbRepo.OrderBook.find({"_id": id})
        .then(order => {
            res.json(order)
        }).catch(err => res.status(500));
});

module.exports = router;
