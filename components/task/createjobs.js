const colors = require('colors');
const kue = require('kue');
const queue = kue.createQueue();
const async = require('async');

const redis = require('redis');
const rsclient = redis.createClient();

var chunks = function(array, size) {
  var results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
};

const createSync = (wallets) => {
  const asyncConcurrent = 1;
  const start = new Date();
  
  const AsyncQueue = async.queue((walletsObject, callback) => {
    const job = queue.create('SyncTx', {
        title: 'Syncing wallet to transactions !',
        type: wallets.type,
        wallets: walletsObject
      }).save((err) => {
          if( !err ) { 
            console.log(`#### Create jobs SyncTx Job Id : ${job.id} successful`.yellow);
            callback();
          } else {
            console.log(`#### Create jobs ${err}`.red);
          }
      });
  }, asyncConcurrent);

  AsyncQueue.push({ walletsObject: wallets });
  AsyncQueue.drain = () => {
    const end = new Date();
    const elaspsed = end.getTime() - start.getTime();
    console.log(`#### Process ${wallets.length} items finish : ${elaspsed} ms`.green);
  }
}

const createWalletSyncingJob = () => {
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
    
      const BTCAddress = [];
      const LTCAddress = [];
      const ETHAddress = [];

      wallets.map((wallet, index) => {
        switch (wallet.type) {
          case 2: 
            BTCAddress.push(wallet);
            break;
          case 3: 
            LTCAddress.push(wallet);
            break
          case 4: 
            ETHAddress.push(wallet);
            break
          default:
            console.log('Not Available Coin');
            break;
        }
      });

      if( BTCAddress.length != 0 ) {
        createSync(BTCAddress);
      }

      if(LTCAddress.length != 0) {
        createSync(LTCAddress);
      }

      if( ETHAddress.length != 0) {
        createSync(ETHAddress);
      }
    });
}

module.exports = {
  createWalletSyncingJob
}
