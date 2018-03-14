var debug = require('debug')('swapr:ethereum');
var swap_manager = require('./swap_manager.js');
var db = require('../db/db_repo');
var async = require('async');
var Web3 = require('web3');

var w3;
var filter;

// Unique chain symbol
var chain_symbol = "ETH";

// DB schemes in use
var liquidity_book = db.LiquidityBookDao;
var nodes_book = db.NodeBookDao;
var order_book = db.OrderBookDao;
var token_book = db.Erc20BookDao;

function getSymbol() {
    return chain_symbol;
}

async function update_liquidity_symbol(symbol) {
    return new Promise(async function(resolve, reject) {
        // Get liquidity account and update in DB, assuming only one account
        var liquidity_account = w3.eth.accounts[0];
        var res = await liquidity_book.createOrUpdate(
            {"currency_symbol" : symbol },
            {"currency_symbol" : symbol, "address": liquidity_account},
            {upsert: true, new: true});
        if (res)
            resolve(symbol + " Liquidity Account: " + liquidity_account);
        else
            reject("Error updating " + symbol + " liquidity account.");
    });
}

async function update_liquidity_tokens(symbol) {
    return new Promise(async function(resolve, reject) {
        // Get liquidity account and update in DB, assuming only one account
        var tokens = await token_book.find({});
        tokens.forEach(token => {
            update_liquidity_symbol(token.currency_symbol)
                .then(msg => {
                })
                .catch(err => {
                    debug(err);
                })
        })
        resolve();
    });
}

async function update_liquidity() {
    return new Promise(async function(resolve, reject) {
        // Get liquidity account and update in DB, assuming only one account
        var liquidity_account = w3.eth.accounts[0];
        var res = await liquidity_book.createOrUpdate(
            {"currency_symbol" : chain_symbol },
            {"currency_symbol" : chain_symbol, "address": liquidity_account},
            {upsert: true, new: true});
        if (res)
            resolve("Ethereum Liquidity Account: " + liquidity_account);
        else
            reject("Error updating Ethereum liquidity account.");
    });
}

async function connect_to_node() {
    return new Promise(async function(resolve, reject) {
        // Connect to Ethereum node
        var node = await nodes_book.findOne({'network_symbol': chain_symbol});

        if (!node)
            reject("Could not find node configuration for: " + chain_symbol);
        
        var eth_node_uri = "http://" + node.hostname + ":" + node.port;
        w3 = new Web3(new Web3.providers.HttpProvider(eth_node_uri));
        
        if (w3.isConnected()) {
            resolve("web3: connected to JSON-RPC at: " + eth_node_uri);
        }
        else {
            reject("web3: error connecting to: " + eth_node_uri);
        }   
    })
}

async function init() {
    return new Promise((resolve, reject) => {
        connect_to_node()
        .then(msg => {
            debug(msg);
            return update_liquidity();
        })
        .then(msg => {
            debug(msg);
            return update_liquidity_tokens();
        })
        .then(msg => {
            resolve("Ethereum initialized successfully");
        })
        .catch(err => {
            reject(err);
        })    
    })
}

function eth_listener(e, log) {
    w3.eth.getBlock(log, function(e, b) {
        for (var i in b.transactions) {
            w3.eth.getTransaction(b.transactions[i], async function(e, tx) {
                //debug(tx.from + " => " + tx.to);
                var from = tx.from.toLowerCase();
                order_book.findOne({"deposit_source_address": tx.from})
                    .then(order => {
                        if (order)
                            return token_book.findOne({"contract_address": tx.to.toLowerCase()})
                                .then(token => {
                                    return {'order': order, 'token': token, 'tx': tx};
                                })
                    })
                    .then(obj => {
                        if (!obj)
                            return;

                        var value = obj.tx.value;

                        if (obj.token) {
                            debug("Tx destination is a token contract.");
                            value = '0x' + obj.tx.input.substr(74).toLowerCase();
                        }

                        debug(obj.tx.from + " ==> " + obj.tx.to + "(" + w3.fromWei(value, 'ether') + ")");
                        swap_manager.complete_swap(obj.order._id, w3.fromWei(value, 'ether'));
                    })
                    .catch(err => {
                        debug("Error: " + err);
                    })
            });
        }
    })
}

function start() {
    return new Promise((resolve, reject) => {
        filter = w3.eth.filter('latest');
        filter.watch(eth_listener);
        resolve("Ethereum listener started");    
    });
}

function stop() {
    return new Promise((resolve, reject) => {
        filter.stopWatching();
        resolve("Ethereum listener stopped");
    });
}

async function transfer(target_coin, target_address, id, target_amount) {
    var liquidity_account = await liquidity_book.findOne({"currency_symbol": target_coin});

    debug("Ethereum transfer: (" + liquidity_account.address + ", " + target_coin + ", " + target_address + ", " + target_amount + ")");
    
    var transactionObject = {
        from: liquidity_account.address,
        to: target_address,
        value: w3.toWei(target_amount, 'ether')
    }

    var tx_promise = new Promise((resolve, reject) => {
        w3.eth.sendTransaction(transactionObject, function(e, r) {
            if (e)
                reject(e);
            debug("r: " + r);
            w3.eth.getTransaction(r, function(e, tx) {
                if (e)
                    reject(e);
                resolve(tx.hash);
            })
        });    
    })
    
    return tx_promise;
}

function getClient() {
    return w3;
}

module.exports.init = init;
module.exports.start = start;
module.exports.stop = stop;
module.exports.getSymbol = getSymbol;
module.exports.transfer = transfer;
module.exports.getClient = getClient;
