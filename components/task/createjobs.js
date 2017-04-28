const colors = require('colors');
const kue = require('kue');
const queue = kue.createQueue();
const async = require('async');

const redis = require('redis');
const rsclient = redis.createClient();

const addressPerChunk = 2;
const createAddrToChunks = (array, size) => {
  array.reduce((arr, item, index) => {
    const ix = Math.floor(index / addressPerChunk);
    // console.log(ix);
    //   // if( !arr[ix] ) {
    //   //   arr[ix] = [];
    //   // }
    //   // arr[ix].push(item);
    //   // return ar;
  });
};

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
      
      console.log(BTCAddress);















      // const chunkWallets = chunks(wallets, wallets.length);
      // console.log(chunkWallets);

      // const asyncConcurrent = 5;
      // const start = new Date();
      // const AsyncQueue = async.queue((wallet, callback) => {
      //   const job = queue.create('SyncTx', {
      //     title: 'Syncing Wallet to Transactions !',
      //     address: wallet.address,
      //     type: wallet.type
      //   }).delay(1000)
      //     .save((err) => {
      //       if( !err ) { 
      //         console.log(`#### Create jobs SyncTx ${job.id} successful`.yellow);
      //         callback();
      //       } else {
      //         console.log(`#### Create jobs ${err}`.red);
      //       }
      //   });
      // }, asyncConcurrent);

      // AsyncQueue.push(wallets);
      // AsyncQueue.drain = () => {
      //   const end = new Date();
      //   const elaspsed = end.getTime() - start.getTime();
      //   console.log(`#### Process ${wallets.length} items finish : ${elaspsed} ms`.green);
      // }
    });

  // },1000);
}

module.exports = {
  updateWalletJob
}
