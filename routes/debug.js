var human_abi = require('human-standard-token-abi');
var debug = require('debug')('swapr:debug');
var express = require('express');
var uuidv4 = require('uuid/v4');
var db = require('../db/db_repo.js');

var router = express.Router();

/*
 * DEBUG Routes
 */

// A debugging route used test token transfers
router.get('/token', function(req, res, next) {
    var alice_account = "0x00CAd64057cE8A324e17f5B205c360637305cf42";
    var bob_account = "0x0095991b80e5a549603da18af19358a1517267f2";
    var gul_address = "0x276ab6c280bca7e1dbf5750b309eab692dd8c7f4";

    var gul = w3.eth.contract(human_abi).at(gul_address);

    gul.balanceOf(swapr_account, function(e,r) {
        if (e) {
            debug(e);
            return;
        }

        debug(w3.fromWei(r.toNumber(), 'wei'));
        balance = r;
        
    });

    gul.transfer(bob_account, 100, {from: swapr_account}, function(e, r) {
        if (e)
            debug(e);
        debug(r);
    });

    res.sendStatus(200);
});

// A debugging route used test transaction finalization
var swap_manager = require('../blockchains/swap_manager.js')
//var ethereum = require('../blockchains/ethereum.js');
router.get('/finish', function(req, res, next) {
    var id = '5a7c1c4508abf54eaa80479b';    
    swap_manager.complete_swap(id, 0.0123);

    res.sendStatus(200);
});

router.get('/btc', function(req, res, next) {
    var handlers = require('../blockchains/handlers.js');
    var btc = handlers.list.get("BTC");

    btc.transfer("key", "BTC", 'mtHkyD33vwPUqAXgvnzRmc1kH9Wu7h7Tdr', 0.03663, function(key){
        debug("Transfer success for: " + key);
    });

    res.sendStatus(200);
});

module.exports = router;
