//For complete API visit: https://github.com/moajs/mongoosedao/blob/master/api.md

var mongoose = require('mongoose');

nodeBookScheme = mongoose.Schema({
    network_symbol: {
        type: String,
        required: true
    },
    hostname: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    timeout: {
        type: Number,
        required: false
    },
});

nodeBookScheme.index({hostname: 1, port: 1}, {unique: true});
//------------------------------------
//            Methods
//------------------------------------

// LiquidityBookScheme.methods. =
//
// LiquidityBookScheme.statics. =

var NodeBookModel = mongoose.model('NodeBookModel', nodeBookScheme);

module.exports = NodeBookModel;

