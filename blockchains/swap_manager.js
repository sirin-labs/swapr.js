var debug = require('debug')('swapr:swap_manager');
var db = require('../db/db_repo.js');
var chains = require('./chains.js');

// DB schemes in use
var order_book = db.OrderBookDao;
var rates_book = db.RateBookDao;

function pair_swap(source, target, amount) {
    return new Promise((resolve, reject) => {
        var pair_key = source.toUpperCase() + '_' + target.toUpperCase();
        rates_book.findOne({"pair": pair_key})
            .then(rate => {
                if (!rate)
                    reject("Missing swap pair: " + pair_key);

                debug("Performing swap for pair: " + pair_key);
                resolve(amount * rate.price);
            })
            .catch(err => {
                reject("Error fetching swap pair: " + pair_key);
        })        
    })
}

// Callback after transaction
function finalize_transfer(order_ticket, tx) {
    debug(order_ticket);
    order_book.deleteById(order_ticket._id)
        .then(debug("Order completed: " + tx));
}

/* The 'deposit' part of the ticket was performed by the
 * client, now we need to finalize the 'target' part of the
 * ticket.
 */
function complete_swap(id, received_funds) {
    order_book.getById(id)
    .then(order_ticket => {
        pair_swap(order_ticket.deposit_source_coin, order_ticket.withdraw_coin, received_funds)
            .then(amount => {
                chains.transferBySymbol(order_ticket.withdraw_coin, 
                    order_ticket.withdraw_address, order_ticket._id, amount)
                    .then(result => {
                        finalize_transfer(order_ticket, result);
                    })
                    .catch(error => {
                        debug(error);
                    })
            })
            .catch(error => {
                return debug(error);
            })
    })
    .catch(error => {
        return debug(error);
    });
}

module.exports.complete_swap = complete_swap;
