const kue = require('kue');
const queue = kue.createQueue();

queue.process('SyncTx', (job, done) => {
  SyncTx(job.data.btc_address, done);
});

function SyncTx(btc_address, done) {
  console.log(btc_address);
  // email send stuff...
  done();
}