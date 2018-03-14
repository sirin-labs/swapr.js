var human_abi = require('human-standard-token-abi');
var debug = require('debug')('swapr:swap');
var express = require('express');
var uuidv4 = require('uuid/v4');
var router = express.Router();

var db = require('../db/db_repo.js');

// DB schemes in use
var order_book = db.OrderBookDao;
var liquidity_book = db.LiquidityBookDao;

router.post('/', function(req, res, next) {
    var order_id = uuidv4();
    debug(req.body);
    liquidity_book.findOne({"currency_symbol": req.body.source_accounts[0].coin})
        .then(liquidity_account => {
            if (!liquidity_account)
                throw("No liquidity account for: " + req.body.source_accounts[0].coin);

            var order_resp = {
                order_id: order_id,
                deposit_address: liquidity_account.address,
                deposit_blend: [
                    {
                        "coin": req.body.source_accounts[0].coin,
                        "address":req.body.source_accounts[0].address
                    }
                ]
            };

            order_ticket = {
                order_id: order_id,
                deposit_source_coin : req.body.source_accounts[0].coin,
                deposit_source_address: req.body.source_accounts[0].address,
                deposit_target_address: liquidity_account.address,
                withdraw_coin : req.body.target_coin,
                withdraw_address : req.body.target_address
            }

            debug(order_ticket);

            var ticket = order_book.create(order_ticket)
                .then(result => {
                    res.json(order_resp);
                })
                .catch(err => {
                    debug(err);
                    res.status(500);
                })
        })
        .catch(err => {
            debug("Error: " + err);
            res.status(500)
        });
});

module.exports = router;
