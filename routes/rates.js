var debug = require('debug')('swapr:rates');
var express = require('express');
var router = express.Router();

const dbRepo = require('../db/db_repo');

// A route used to query current open orders
router.get('/', function(req, res, next) {

    dbRepo.RateBookDao.getAll()
        .then(rates_arr => {
            var result = [];
            rates_arr.forEach(rate => {result.push({"pair":rate.pair, "price":rate.price})})
            res.json(result)
        })
        .catch(err => res.status(500));
});

// A route used to query current open orders
router.get('/:pair', function(req, res, next) {

    pair = req.params.pair;

    dbRepo.RateBookDao.findOne({"pair":pair})
        .then(rate => {
            res.json({"pair":rate.pair, "price":rate.price})
        })
        .catch(err => res.status(500));
});

module.exports = router;
