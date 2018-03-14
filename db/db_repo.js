const MongooseDao = require('./dao');
const liquidityBookModel = require('./mongoose/models/liquidity_model');
const nodeBookModel = require('./mongoose/models/node_model');
const OrderBookModel = require('./mongoose/models/order_model');
const rateBookModel = require('./mongoose/models/rate_model');
const supportedCoinsBookModel = require('./mongoose/models/supported_coins_model');
const erc20BookModel= require('./mongoose/models/erc20_model');
const mongoose = require('mongoose');
const debug = require('debug')('swapr:db_repo');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test', { useMongoClient: true }, function(err) {
    if (err)
        debug('mongodb: Connection error.', err);
});

const liquidityBookDao = new MongooseDao(liquidityBookModel);
const nodeBookDao = new MongooseDao(nodeBookModel);
const rateBookDao = new MongooseDao(rateBookModel);
const orderBookDao = new MongooseDao(OrderBookModel);
const supportedCoinsBookDao = new MongooseDao(supportedCoinsBookModel);
const erc20BookDao = new MongooseDao(erc20BookModel);

module.exports.NodeBookDao = nodeBookDao;
module.exports.OrderBookDao = orderBookDao;
module.exports.RateBookDao = rateBookDao;
module.exports.SupportedCoinsBookDao = supportedCoinsBookDao;
module.exports.LiquidityBookDao = liquidityBookDao;
module.exports.LiquidityBookModel = liquidityBookModel;
module.exports.Erc20BookDao = erc20BookDao;
