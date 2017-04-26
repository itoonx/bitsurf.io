const fetchUrl = require("fetch").fetchUrl;
const redis = require("redis");
const rsclient = redis.createClient();
const kue = require('kue');
const queue = kue.createQueue();
const fullnode = require('../config/fullnode.config');

const bitcoin = {
  sync: function() {
    fetchUrl(`${fullnode.btc.live}/status`, function(err, meta, body) {
      if (err) {
        console.log(new Error(err));
      }
      rsclient.set('bitcoinstatus', body.toString());
      console.log(`BTC : ${body.toString()}`);
    });
  }
}

module.exports = { bitcoin };