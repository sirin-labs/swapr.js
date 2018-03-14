var debug = require('debug')('swapr:bitcoin');
var swap_manager = require('./swap_manager.js')
var db = require('../db/db_repo.js');
var bitcoin = require('bitcoin-promise');

// Unique chain symbol
var chain_symbol = "BTC";

// DB schemes in use
var liquidity_book = db.LiquidityBookDao;
var nodes_book = db.NodeBookDao;
var order_book = db.OrderBookDao;

var client;
var interval_id;
var node_config;

function getSymbol() {
    return chain_symbol;
}

function init() {
    return new Promise(async function (resolve, reject) {
        nodes_book.findOne({'network_symbol': chain_symbol})
            .then(node => {
                node_config = {
                    host: node.hostname,
                    port: node.port,
                    user: node.username,
                    pass: node.password,
                    timeout: node.timeout
                };        

                client = new bitcoin.Client(node_config);
                return client.getBlockchainInfo();
            })
            .then(info => {
                debug("Bitcoin: connected to JSON-RPC at: http://" + node_config.host + ":" + node_config.port);
                return client.getNewAddress();        
            })
            .then (address => {
                debug("Bitcoin Liquidity Account: " + address);
                return liquidity_book.createOrUpdate(
                    {"currency_symbol" : chain_symbol },
                    {"currency_symbol" : chain_symbol, "address": address},
                    {upsert: true, new: true});
            })
            .then(res => {
                resolve("Bitcoin initialized successfully");
            })
            .catch(err => {
                reject(err);
            })
    });
}

async function bitcoin_listener() {
    var received = await client.listReceivedByAddress(0, false, false);
    var liquidity = await liquidity_book.findOne({"currency_symbol" : chain_symbol});

    if (!received)
        return;

    received.forEach(async function(tx) {
        var order = await order_book.findOne({'deposit_target_address': tx.address});
        if (order) {
            debug("TXID: " + tx.txids + ", to: " + tx.address + " (" + tx.amount + ")");
            swap_manager.complete_swap(order._id, tx.amount);
        }
    });
}

function start() {
    return new Promise((resolve, reject) => {
        interval_id = setInterval(bitcoin_listener, 2000);
        resolve("Bitcoin listener started")    
    });
}

function stop() {
    return new Promise((resolve, reject) => {
        clearInterval(interval_id);
        resolve("Bitcoin listener stopped");
    });
}

function transfer(target_coin, target_address, id, target_amount) {
    debug("Bitcoin transfer: (" + target_coin + ", " + target_address + ", " + target_amount + ")");
    
    return new Promise((resolve, reject) => {
        client.sendToAddress(target_address, target_amount.toFixed(6))
            .then(tx => {
                debug("Bitcoin TXID: " + tx);
                resolve(tx);
            })
            .catch(err => {
                reject(err);
            });
        });   
}

module.exports.init = init;
module.exports.start = start;
module.exports.stop = stop;
module.exports.getSymbol = getSymbol;
module.exports.transfer = transfer;
