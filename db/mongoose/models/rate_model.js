//For complete API visit: https://github.com/moajs/mongoosedao/blob/master/api.md

var mongoose = require('mongoose');

RateBookScheme = mongoose.Schema({
    pair: {
        type: String,
        unique: true
    },
    price: {
        type: String,
    }
});




//------------------------------------
//            Methods
//------------------------------------

// LiquidityBookScheme.methods. =
//
// LiquidityBookScheme.statics. =

var RateBookModel = mongoose.model('RateBookModel', RateBookScheme);

module.exports = RateBookModel;

