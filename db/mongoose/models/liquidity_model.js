//For complete API visit: https://github.com/moajs/mongoosedao/blob/master/api.md

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
LiquidityBookScheme = new Schema({
    currency_symbol: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    }
});

LiquidityBookScheme.index({currency_symbol: 1, address: 1}, {unique: true});

//------------------------------------
//            Methods
//------------------------------------

// LiquidityBookScheme.methods. =
//
// LiquidityBookScheme.statics. =

var liquidityBookModel = mongoose.model('LiquidityBookModel', LiquidityBookScheme);

module.exports = liquidityBookModel;

