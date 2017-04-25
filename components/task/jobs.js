const mongoose = require('mongoose');
const debug = require('debug');
const util = require('util');
const RedisServer = require('redis-server');
const redis = require('redis');
const rsclient = redis.createClient();

const kue = require('kue');
const queue = kue.createQueue();

const wallet = require('../api/wallet/wallet.model');
const config = require('../../config/environments');

// plugin promise in mongoose
mongoose.Promise = Promise;

// connect to mongodb
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 3600 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

wallet.find()
  .then((callback) => {
    callback.forEach((wallet) => {
      const job = queue.create('SyncTx', {
        title: 'Syncing BTC Transactions',
        btc_address: wallet.address
      }).save((err) => {
        if( !err ) console.log(`Create jobs SyncTx ${job.id} successful`);
      });
    })
  })
  .catch((e) => {
    console.log(`Error find wallet : ${e}`);
  });
