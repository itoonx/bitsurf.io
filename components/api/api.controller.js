var httpStatus = require('http-status');
var redis = require('redis');
var rsclient = redis.createClient();
var config = require('../../config/environments');

const info = function(req, res, next) {
  res.status(httpStatus.OK).json({
    status: 'ok',
    date: new Date(),
    version: 1,
    environment: config.env
  });
};

const BTCStatus = function(req, res, next) {
  rsclient.get('bitcoinstatus', function(err, reply) {
    res.status(httpStatus.OK).json( JSON.parse(reply) );
    console.log(reply);
  });
}

module.exports = { info, BTCStatus };
