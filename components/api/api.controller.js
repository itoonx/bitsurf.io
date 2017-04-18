var httpStatus = require('http-status');
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
  res.status(httpStatus.OK).json({
    network: 'live',
    estimate_fee: 12.00
  });
}

module.exports = { info, BTCStatus };
