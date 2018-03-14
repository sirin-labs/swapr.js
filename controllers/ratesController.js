const debug = require('debug')('swapr:rates');
const coinMarketCap = require('coinmarketcap-api');
const dbRepo = require('../db/db_repo');

var UPDATE_PAIR_PRICES_INTERVAL = 10 * 1000;

const client = new coinMarketCap();

setInterval(updatePairPrices, UPDATE_PAIR_PRICES_INTERVAL)

async function updatePairPrices() {

    var coins = await dbRepo.SupportedCoinsBookDao.getAll()

    var supported_coins = [];
    for (let i = 0; i < coins.length; i++) {
        supported_coins.push(coins[i].name);
    }

    var rates_in_btc = await _fetchPrices(supported_coins);

    for (let i = 0; i < supported_coins.length; i++) {
        for (let j = 0; j < supported_coins.length; j++) {

            if (i == j) {
                continue;
            }

            var from_coin_name = rates_in_btc.get(supported_coins[i]).symbol;
            var from_coin_price = rates_in_btc.get(supported_coins[i]).price_btc;
            var to_coin_name = rates_in_btc.get(supported_coins[j]).symbol;
            var to_coin_price = rates_in_btc.get(supported_coins[j]).price_btc;

            var pair = from_coin_name + '_' + to_coin_name;
            var pair_price = 1 / to_coin_price * from_coin_price;

            //debug("pair:" + pair + ", pair_price:" + pair_price);
            dbRepo.RateBookDao.createOrUpdate(
                {"pair": pair} ,
                {"pair": pair, "price": pair_price},
                {upsert: true, new: true})
                .then(/*doc => debug(doc)*/);
        }
    }
}

async function _fetchPrices(supported_coins) {
    var rates_in_btc = new Map();
    for (let i = 0; i < supported_coins.length; i++) {
        let response = await client.getTicker({limit: 1, currency: supported_coins[i]});
        rates_in_btc.set(supported_coins[i], {symbol: response[0].symbol, price_btc: response[0].price_btc});
        //debug("symbol:" + response[0].symbol + ", price_btc:" + response[0].price_btc)
    }

    return rates_in_btc;
}