'use stict';
var mongoose = require('mongoose');
var config = require('./config/environments');
var app = require('./config/express');
var blockchains = require('./blockchains/broker');

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

  // blockchains.bitcoinStatus();

});
