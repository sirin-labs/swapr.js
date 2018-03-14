# SWAPR #

SWAPR is a cryptocurreny conversion back-end written in node.js.
It exposes a REST API which clients use to create conversion "orders", stored as "tickets" in the db.
Orders are completed when clients deposit funds into the account specified by SWAPR which in turn deposits
the requested coin back and thus completing the conversion order.

The main motiviation for SWAPR is to allow seamless crypto-to-crypto conversions for the SirinOS Dapps eco-system.
Each Dapp may require it's own token but for a SirinOS user, it is possible to hold only SRN, Bitcoin, Ether or other supported
coins/tokens and be able to convert to all Dapp tokens that take part of the SirinOS eco-system.

## Installation and Usage ##



### Installing Dependencies ###

* ```sudo npm install nodemon nsp snyk -g```
* ```sudo apt install jq curl -y```

### Usage ###

* Navigate to repo dir.
* ```npm install```
* ```DEBUG=swapr:* PORT=8080 nodemon swapr```

### Staging Deployment ###

The staging environment is accessible only from SIRIN R&D offices.
If you intend to fork swapr.js you need to setup Bitcoin (bitcoind) and Ethereum (parity / geth) full nodes.

* The staging deployment is at: [www.swapr.rocks](http://www.swapr.rocks/ "www.swapr.rocks").
* An Ethereum node is deployed to: [eth.swapr.rocks](http://eth.swapr.rocks/ "eth.swapr.rocks").
* A Bitcoin node is deployed to: [btc.swapr.rocks](http://btc.swapr.rocks/ "btc.swapr.rocks").

### Kovan Test Net Tokens ###

Demo tokens created on the Kovan Network:

* SRN: ```0x68f2b68F30e1b6379661514d0eD6eFB66A19cEdC```
* STX: ```0x5f828aA8f82754E19f8af519E735e582bf609B2b```

## Testing & Debugging ##

### Test Scripts ###

Test scripts that emulate client requests are found in the ```scripts/``` directory.

* ```orders.sh```: sends a GET request to query open orders. 
* ```rates.sh```: sends a GET request to query exchange rates. 
* ```drop_orders.sh```: clears all open orders. 
* ```swap.js```: sends a POST request to open a new swap order. 

### Vulnerable Packages ###

Using [NSP](https://nodesecurity.io/ "NSP") and [Snyk](https://snyk.io "Snyk") to test for vulnerable packages in our code:

* ```npm run-script pentest```

### Environment Variables ###

The following environment variables are supported:

* ```DEBUG```: Used to enable and filter debug console logs. Disabled by default. example: ```DEBUG=swapr:ethereum nodemon swapr```.
* ```DEBUG_ROUTES```: Used to enable debug routes found in routes/debug.js. Disabled by default. example: ```DEBUG_ROUTES=true nodemon swapr```.


## REST API ##

### POST /swap ###
This is the main route, the client requests a swap and an order is created.
The server responds with instructions how to complete the order.

#### Client Request JSON Format ####
```json
{
    'target_coin':'SRN',
    'target_address':'0x0095991b80E5A549603da18Af19358A1517267F2',
    'source_accounts': [
        {
            'coin': 'ETH',
            'address': '0x0095991b80E5A549603da18Af19358A1517267F2'
        }
    ]
}
```

#### Server Response JSON Format ####
```json
{
    'order_id': '36397e44-c579-41fb-a881-380ce98b8804',
    'deposit_address': '0x00e8fb8ff60845f4d88b955b7e1d0cc6bff0806f',
    'deposit_blend': [
        {
            'coin': 'ETH',
            'address': '0x0095991b80E5A549603da18Af19358A1517267F2'
        }
    ]
}
```

### GET /orders ###
A debug route used to query the order book.

### GET /orders/:id ###
A debug route used to query a specific order id.

### GET /rates ###
Used to query the rates table for all pairs.

#### Server Response JSON Format ####
```json
[
    {
       'pair': 'ETH-SRN',
       'rate': '0.56' 
    },
    {
       'pair': 'SRN-ETH',
       'rate': '1.78'
    }
]
```

### GET /rates/:pair ###
Used to query the rate for a specific pair.

### GET /supported_coins ###
Used to query the rate for a specific pair.

#### Server Response JSON Format ####
```json
[
    'ETH',
    'SRN',
    'STX'
]
```
