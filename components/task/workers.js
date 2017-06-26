const colors = require('colors');
const kue = require('kue');
const queue = kue.createQueue();
const async = require('async');
const redis = require('redis');
const rsclient = redis.createClient();
const fetch = require('fetch');
const blockchains = require('../../blockchains/broker');
const fullNodeConfig = require('../../config/fullnode.config');
const Wallet = require('../api/wallet/wallet.model');

const syncWorker = () => {
  queue.process('SyncTx', (job, done) => {
    SyncTx(job.data.wallets, done);
  });

  function SyncTx(wallets, done) {
    console.log(`✔ --> Worker Process Sync Transaction`.bold);
    console.log(`[ Sync ] Multiple Address | Size : ${wallets.length} `);

    wallets.map((item, index) => {
      console.log(item);
    });

    // fetch.fetchUrl(`${fullNodeConfig.btc.live}/addr/${address}`, (err, meta, response) => {
    //   const result = JSON.parse(response);
    //   Wallet.findOne({ address: address })
    //     .then((callback) => {
    //       if (callback.txApperances !== result.txApperances) {
    //         // found new tx
    //         // get last transaction
    //         console.log(`### Found new transaction !!! | Address : ${callback.address} `.green);
    //         callback.balance = result.balance;
    //         callback.balanceSat = result.balanceSat;
    //         callback.totalReceivedSat = result.totalReceivedSat;
    //         callback.totalSent = result.totalSent;
    //         callback.unconfirmedBalanceSat = result.unconfirmedBalanceSat;
    //         callback.unconfirmedTxApperances = result.unconfirmedTxApperances;
    //         callback.txApperances = result.txApperances;
    //         // callback.save((saved) => {
    //         //   console.log(`### Updated Wallet ${saved.address} finished`);
    //         // })
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // });
    done();
  }
}
module.exports = {
  syncWorker
}