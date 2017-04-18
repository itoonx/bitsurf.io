var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var logger = require('morgan');
var expressWinston = require('express-winston');
var winstonInstance = require('./winston');
var apiRoutes = require('../components/api/api.route');
var config = require('../config/environments');

const app = express();

// set enable logger for development mode
if (config.env === 'development') {
  app.use(logger('dev'));
}

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

app.use('/api', apiRoutes);

app.use('/static', express.static('public'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({ message: 'Page Not Found' });
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

module.exports = app;