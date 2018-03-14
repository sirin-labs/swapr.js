//For complete API visit: https://github.com/moajs/mongoosedao/blob/master/api.md

var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

OrderBookScheme = mongoose.Schema({
    deposit_source_coin: {
        type: String,
    },
    deposit_source_address: {
        type: String,
    },
    deposit_target_address: {
        type: String,
    },
    withdraw_coin: {
        type: String,
    },
    withdraw_address: {
        type: String,
    },
    rate: {
        type: String,
    },
    state: {
        type: String, enum: ['open', 'pending', 'closed']
    }
});

OrderBookScheme.plugin(timestamps);

var OrderBookModel = mongoose.model('OrderBookModel', OrderBookScheme);

module.exports = OrderBookModel;

