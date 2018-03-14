//For complete API visit: https://github.com/moajs/mongoosedao/blob/master/api.md

var mongoose = require('mongoose');

SupportedCoinsBookScheme = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    currency_symbol: {
        type: String,
        unique: true
    },
    decimal: {
        type: String,
    }
});


//------------------------------------
//            Methods
//------------------------------------

// LiquidityBookScheme.methods. =
//
// LiquidityBookScheme.statics. =

var SupportedCoinsBookModel = mongoose.model('SupportedCoinsBookModel', SupportedCoinsBookScheme);

module.exports = SupportedCoinsBookModel;

