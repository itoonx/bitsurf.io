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
    console.log(`#### Start worker for process all wallet to transactions`.yellow);
    console.log(`#### Address in worker Length is ${wallets.walletsObject.length} `.yellow);

    const pairwallets = wallets.walletsObject;
    pairwallets.map((item, index) => {
      // console.log(item.address);
    });

    // blockchains.bitcoin.searchrawtransactions('1PZPGsG6PDREByisJwCK9Na2MVXipnS3eL', (err, response) => {
    //   if ( !err ) {

    //     const address = JSON.parse(response);
    //     var hash160 = null;
    //     var total_received = 0;
    //     var total_sent = 0;
    //     var final_balance = 0;
    //     var final_balance = 0
    //     var n_tx = 0;

    //     address.forEach((addr, index) => {

    //       var vin = 0;
    //       // addr.vin.map((txid) => {
    //       //   console.log(txid);
    //       // });

    //       // console.log(addr);
          
    //     });

    //     console.log(address);
        

        

    //   } else {
    //     console.log('xxx');
    //   }
    // })
    
    done();
  }
}
module.exports = {
  syncWorker
}