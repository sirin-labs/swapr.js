#!/usr/bin/env node
'use strict';
 
var ArgumentParser = require('argparse').ArgumentParser;
var debug = require('debug')('swap');
var request = require('request');
var path = require('path');

debug.enabled = true;

var exit = false;

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Test script to create POST request for SWAPR'
});

parser.addArgument(
  [ '-w', '--web-api-address' ],
  {
    help: 'SWAP URL',
    defaultValue: 'http://localhost:8080'
  }
);
parser.addArgument(
  [ '--src-addr' ],
  {
    help: 'Source Address'
  }
);
parser.addArgument(
  [ '-s', '--src-coin' ],
  {
    help: 'Source Coin',
    required: true
  }
);
parser.addArgument(
  [ '--tgt-addr' ],
  {
    help: 'Target Address'
  }
);
parser.addArgument(
  [ '-t', '--tgt-coin' ],
  {
    help: 'Target Coin',
    required: true
  }
);
parser.addArgument(
  [ '-p', '--permutations' ],
  {
    help: 'Show possible script args permutations',
    action: 'storeTrue',
    defaultValue: false
  }
);
parser.addArgument(
  [ '-u', '--simulate' ],
  {
    help: 'Print resulting request JSON and exit',
    action: 'storeTrue',
    defaultValue: false
  }
);

var args = parser.parseArgs();

var coins = [
		{coin: 'ETH', address: '0x0095991b80e5a549603da18af19358a1517267f2'}, 
		{coin: 'BTC', address: 'mtHkyD33vwPUqAXgvnzRmc1kH9Wu7h7Tdr'},
		{coin: 'SRN', address: '0x0095991b80e5a549603da18af19358a1517267f2'},
		{coin: 'STX', address: '0x0095991b80e5a549603da18af19358a1517267f2'}
	];

if (args.permutations)
{
	var prog = path.basename(process.argv[1]);
	coins.forEach(src_coin => {
		coins.forEach(dst_coin => {
			if (src_coin === dst_coin)
				return;
			console.log(prog + " -s " + src_coin.coin + 
				" --src-addr " + src_coin.address + 
				" -t " + dst_coin.coin + 
				" --tgt-addr " + dst_coin.address);
		})		
	})

    exit = true;
}

if (!args.tgt_addr)
	args.tgt_addr = coins.find(a => a.coin === args.tgt_coin).address;

if (!args.src_addr)
	args.src_addr = coins.find(a => a.coin === args.src_coin).address;


var request_obj = {
    "target_coin": args.tgt_coin,
    "target_address": args.tgt_addr,
    "source_accounts":[
        {   
            "coin": args.src_coin,
            "address": args.src_addr
        }
    ]
}

if (args.simulate)
{
	debug(request_obj);
	exit = true;
}

if (exit)
	process.exit(0);

var options = {
  uri: args.web_api_address + '/swap',
  method: 'POST',
  json: request_obj
};

debug("Sending request to: " + args.web_api_address);
debug(request_obj);
debug("");

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        debug("Received reply from server:");
        debug(response.body);
        debug("");
    }
});

