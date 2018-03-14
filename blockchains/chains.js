var debug = require('debug')('swapr:chains');

// Runtime handlers DB 
var handlers = new Map();

// Include all supported blockchains
var ethereum = require('./ethereum.js')
var tokens = require('./tokens.js')
var bitcoin = require('./bitcoin.js')

// Add all blockchains to handlers list
handlers.set(ethereum.getSymbol(), ethereum);
handlers.set(bitcoin.getSymbol(), bitcoin);
handlers.set('STX', tokens);
handlers.set('SRN', tokens);

// Initialize and start all handlers
handlers.forEach((handler, key) => {
	handler.init()
		.then(msg => {
			if (msg)
				debug(msg);
			return handler.start();
		})
		.then(msg => {
			if (msg)
				debug(msg);
		})
		.catch(err => {
			debug(err);
		})
});

function transferBySymbol(target_symbol, target_address, order_id, amount) {
    target_handler = handlers.get(target_symbol);
    return target_handler.transfer(target_symbol, target_address, order_id, amount);
}

function stopBySymbol() {

}

function startBySymbol() {
    
}

module.exports.transferBySymbol = transferBySymbol;
module.exports.stopBySymbol = stopBySymbol;
module.exports.startBySymbol = startBySymbol;
