//For complete API visit: https://github.com/moajs/mongoosedao/blob/master/api.md

var mongoose = require('mongoose');

Erc20BookScheme = mongoose.Schema({
    currency_symbol: {
        type: String,
        unique: true
    },
    contract_address: {
        type: String,
        unique: true
    }
});


var Erc20BookModel = mongoose.model('Erc20BookModel', Erc20BookScheme);

module.exports = Erc20BookModel;
