const debug = require('debug')('swapr:admin');
const express = require('express');
const router = express.Router();
const dbRepo = require('../db/db_repo');

router.get('/db/init', function (req, res, next) {
    const config = require('../db/db_config');

    initNodes(config.nodes);
    initSupportedCoins(config.supported_coins);
    initErc20Tokens(config.erc20);
    res.status(200);
});

function initNodes(nodesArray) {
    nodesArray.forEach(function (nodeObj) {

        dbRepo.NodeBookDao.create({
            "network_symbol": nodeObj.network_symbol,
            "hostname": nodeObj.hostname,
            "port": nodeObj.port,
            "username": nodeObj.username,
            "password": nodeObj.password,
            "timeout": nodeObj.timeout
        }).then(nodeBook => {
            debug("new node record  network_symbol: " + nodeBook.network_symbol + " , hostname: " + nodeBook.hostname + ", port: " + nodeBook.port + " was created");
        }).catch(reason => {
            debug("error while creating node record: " + reason);
        });
    });
}

function initSupportedCoins(supportedCoinsArray) {
    supportedCoinsArray.forEach(function (supportedCoinObj) {

        dbRepo.SupportedCoinsBookDao.create({
            "currency_symbol": supportedCoinObj.currency_symbol,
            "decimal": supportedCoinObj.decimal,
            "name": supportedCoinObj.name,
        }).then(supportedCoinObj => {
            debug("new supported coin record  currency_symbol: " + supportedCoinObj.currency_symbol + " , decimal: " + supportedCoinObj.decimal + " was created");
        }).catch(reason => {
            debug("error while creating supported coin record: " + reason)
        });
    });
}

function initErc20Tokens(erc20Tokens) {
    erc20Tokens.forEach(function (erc20Obj) {
        dbRepo.Erc20BookDao.create({
            "currency_symbol": erc20Obj.currency_symbol,
            "contract_address": erc20Obj.contract_address
        }).then(supportedCoinObj => {
            debug(erc20Obj.name + " was created");
        }).catch(reason => {
            debug("error while creating erc20 coin record: " + reason)
        });
    });
}


module.exports = router;

