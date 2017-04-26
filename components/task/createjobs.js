const kue = require('kue');
const queue = kue.createQueue();
const async = require('async');

const redis = require('redis');
const rsclient = redis.createClient();

const updateWalletJob = () => {
  setInterval(() => {
    const wallets = [];
    rsclient.get("wallet", (err, callback) => {
      if( !err ) {
        const reply = JSON.parse(callback);
        reply.map((item, index) => {
          wallets.push({
            id: index,
            address: item.address,
            type: item.type
          });
        });
      }

      const asyncConcurrent = 5;
      const start = new Date();
      const AsyncQueue = async.queue((wallet, callback) => {
        const job = queue.create('SyncTx', {
          title: 'Syncing Wallet to Transactions !',
          address: wallet.address,
          type: wallet.type
        }).delay(1000)
          .save((err) => {
            if( !err ) { 
              console.log(`#### Create jobs SyncTx ${job.id} successful`);
              callback();
            } else {
              console.log(`#### Create jobs ${err}`);
            }
        });
      }, asyncConcurrent);

      AsyncQueue.push(wallets);
      AsyncQueue.drain = () => {
        const end = new Date();
        const elaspsed = end.getTime() - start.getTime();
        console.log(`#### Process items ${wallets.length} finish : ${elaspsed} ms`);
      }
    });
  },20000);
}

module.exports = {
  updateWalletJob
}
