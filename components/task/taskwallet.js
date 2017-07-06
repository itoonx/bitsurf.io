const mongoose = require('mongoose');
const colors = require('colors');
const debug = require('debug');
const util = require('util');
const RedisServer = require('redis-server');
const redis = require('redis');
const rsclient = redis.createClient();
const kue = require('kue');
const queue = kue.createQueue();

const wallet = require('../api/wallet/wallet.model');

module.exports = {

  loadWalletToRedis: () => {
    wallet.find()
      .then((callback) => {
        const address = [];
        callback.map((wallet, index) => {
          address.push({ index: index, address: wallet.address, type: wallet.type });
        });
        rsclient.set('wallet', JSON.stringify(address));
        console.log(`#### Loaded all wallet from redis`.yellow);
      })
      .catch((err) => {
        console.log(`Error find wallet : ${err}`.red);
      });
  }

}
