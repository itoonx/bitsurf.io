'use stict';
const mongoose = require('mongoose');
const RedisServer = require('redis-server');
const redis = require('redis');
const rsclient = redis.createClient();

const config = require('./config/environments');
const app = require('./config/express');
const blockchains = require('./blockchains/broker');

const kue = require('kue');
kue.createQueue();
kue.app.listen(3000);
kue.app.set('title', 'Bitsruf.io : Job Monitor');

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
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    // debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.listen(config.port, ()  => {
  console.info('☛ Bitsurf - The easiest way to send & receive cryptocurrency');
  console.log(`✔ Bitsurf has started on: ${config.port}`);
});

blockchains.bitcoin.sync();