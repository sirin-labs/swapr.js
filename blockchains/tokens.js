var human_abi = require('human-standard-token-abi');
var debug = require('debug')('swapr:tokens');
var Web3 = require('web3');
var db = require('../db/db_repo.js');
var swap_manager = require('./swap_manager.js')
var ethereum = require('./ethereum.js');

// DB schemes in use
var liquidity_book = db.LiquidityBookDao;
var token_book = db.Erc20BookDao;

// Depends on the Ethereum chain listener.
function init() {
    return new Promise(resolve => {
        resolve();
    })
}

function start() {
    return new Promise(resolve => {
        resolve();
    })
}

function stop() {
    return new Promise(resolve => {
        resolve();
    })
}

function getSymbol() {
    
}

function transfer(target_coin, target_address, id, target_amount) {
    return new Promise(async function(resolve, reject) {
        try {
            w3 = ethereum.getClient();

            var token = await token_book.findOne({"currency_symbol": target_coin});
            if (!token.contract_address)
                reject("Error fetching contract address for: " + target_coin);

            var liquidity_account = await liquidity_book.findOne({"currency_symbol": "ETH"});
            if (!liquidity_account.address)
                reject("Error fetching Ethereum liquidity account");

            var token_contract = w3.eth.contract(human_abi).at(token.contract_address);

            debug("Token transfer: (" + target_coin + "), " + liquidity_account.address + "=>" + target_address + " (" + target_amount + ")");
            token_contract.transfer(target_address, w3.toWei(target_amount, 'ether'), {from: liquidity_account.address}, function(e,r) {
                if (e)
                    reject(e);

                resolve(r);
            });
        } catch (err) {
            debug("Token transfer failed: " + err);
        }
    });    
}

module.exports.init = init;
module.exports.start = start;
module.exports.stop = stop;
module.exports.getSymbol = getSymbol;
module.exports.transfer = transfer;
