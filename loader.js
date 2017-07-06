'use stict';

import sourceMapSupport from 'source-map-support';
sourceMapSupport.install({
  environment: 'node',
  handleUncaughtExceptions: false
})

import colors from 'colors';
import mongoose from 'mongoose';
import RedisServer from 'redis-server';
import redis from 'redis';
import debug from 'debug';
import bitcoinrpc from 'bitcoin';
import util from 'util';
import kue from 'kue';

import config from './config/environments';
import app from './config/express';
import blockchains from './blockchains/broker';

// Task
import taskWallet from './components/task/taskwallet';
import taskJob from './components/task/createjobs';
import taskWorker from './components/task/workers';

process.on('uncaughtException', (err) => {
  console.error('---------------------------------------------------------');
  console.error('An uncaught exception occurred!');
  console.error('---------------------------------------------------------');
  console.error(sourceMapSupport.getErrorSource(err));
  console.error(err.stack);
  console.error('---------------------------------------------------------')
  process.exit(1);
})

kue.createQueue();
kue.app.listen(3000);
kue.app.set('title', 'Bitsruf.io : Job Monitor');

const rsclient = redis.createClient();
const server = new RedisServer(6399);
server.open().then().catch((err) => {
  console.log(`Redis has problem : ${err}`);
});

// plugin promise in mongoose
mongoose.Promise = Promise;

// connect to mongodb
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 3600 } } });

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
})

mongoose.connection.on('connected', () => {
  console.log(`[ Database ] MongoDB Connected!!`.blue);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.listen(config.port, ()  => {
  console.info('☛ Bitsurf - The easiest way to send & receive cryptocurrency'.bold);
  console.log(`✔ Bitsurf has started on: ${config.port}`.bold);
});

// run worker $ job
blockchains.bitcoin.connect((err, connected) => {
  connected.cmd('getbalance', '*', 6, function(err, balance, resHeaders) {
    if (err) {
      return console.log(err)
    } else {
      console.log(`[ RPC ] Bitcoin RPC Connected!!`.blue);
      taskJob.createWalletSyncingJob();
      taskWorker.syncWorker();
    }
  });
})

taskWallet.loadWalletToRedis();