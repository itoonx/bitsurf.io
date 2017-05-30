const fetchUrl = require("fetch").fetchUrl;
const redis = require("redis");
const bitcoinrpc = require('bitcoin');
const rsclient = redis.createClient();
const kue = require('kue');
const queue = kue.createQueue();
const fullnode = require('../config/fullnode.config');

function getBitcoinRPCConnection (connection) {
  const client = new bitcoinrpc.Client({
    host: fullnode.btc.live,
    user: fullnode.btc.rpcuser,
    pass: fullnode.btc.rpcpassword,
    port: fullnode.btc.rpcport,
    timeout: fullnode.btc.rpctimeout
  });
  connection(client);
}

const bitcoin = {
  connect: (callback) => {
    getBitcoinRPCConnection((connected) => {
      callback(connected);
    })
  },

   getinfo: () => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getinfo', (err, info) => {
        if (err) return console.log(err);
        const infoJSON = JSON.stringify(info);
        rsclient.set('bitcoinstatus', infoJSON.toString());
        console.log(`✔ --> Bitcoin Info`.bold);
        console.log(`${infoJSON.toString()}`);
      })
    })
  },

  getrawtransaction: (txid, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getrawtransaction', txid, (err, rawtx) => {
        if (err) return console.log(err);
        const rawtransaction = JSON.stringify(rawtx);
        callback(rawtransaction);
      })
    })
  },

  decoderawtransaction: (rawtx, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getrawtransaction', txid, (err, rawtx) => {
        if (err) return console.log(err);
        const rawtransaction = JSON.stringify(rawtx);
        callback(rawtransaction);
      })
    }); 
  },

  

}

module.exports = { bitcoin };