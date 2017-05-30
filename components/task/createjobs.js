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

const createSyncBitcoinAddressJob = (wallets) => {
  const asyncConcurrent = 1;
  const start = new Date();
  const AsyncQueue = async.queue((address, callback) => {

    const job = queue.create('SyncTx', {
      title: 'Syncing Wallet to Transactions !',
      type: 'BTC',
      wallets: wallets
    }).save((err) => {
        if( !err ) { 
          console.log(`#### Create jobs SyncTx Job Id : ${job.id} successful`.yellow);
          callback();
        } else {
          console.log(`#### Create jobs ${err}`.red);
        }
    });

  }, asyncConcurrent);

  AsyncQueue.push({ address: wallets.address });
  AsyncQueue.drain = () => {
    const end = new Date();
    const elaspsed = end.getTime() - start.getTime();
    console.log(`#### Process ${wallets.length} items finish : ${elaspsed} ms`.green);
  }
}

const updateWalletJob = () => {
  // setInterval(() => {

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
            BTCAddress.push(wallet.address);
            break;
          case 3: 
            LTCAddress.push(wallet.address);
            break
          case 4: 
            ETHAddress.push(wallet.address);
            break
          default:
            console.log('Not Available Coin');
            break;
        }
      });
      createSyncBitcoinAddressJob(BTCAddress);
      // Create Bitcoin Syncing to Transaction
    });
  // },1000);
}

module.exports = {
  updateWalletJob
}
