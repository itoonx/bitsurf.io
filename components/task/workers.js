const kue = require('kue');
const queue = kue.createQueue();
const async = require('async');
const redis = require('redis');
const rsclient = redis.createClient();
const fetch = require('fetch');
const fullNodeConfig = require('../../config/fullnode.config');
const Wallet = require('../api/wallet/wallet.model');

const syncWorker = () => {
  queue.process('SyncTx', (job, done) => {
    SyncTx(job.data.address, done);
  });

  function SyncTx(address, done) {
    fetch.fetchUrl(`${fullNodeConfig.btc.live}/addr/${address}`, (err, meta, response) => {
      // console.log(response.toString());

      const result = JSON.parse(response);
      console.log(result);

      // Wallet.findOne({ address: address })
      //   .then((callback) => {
      //     callback.final = response.balanceSat;
      //     callback.


          
      //     console.log(callback);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
        done();
    });
  }
}
module.exports = {
  syncWorker
}