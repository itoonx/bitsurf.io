const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const logger = require('morgan');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const winstonInstance = require('./winston');
const apiRoutes = require('../components/api/api.route');
const config = require('../config/environments');
const APIError = require('../components/helpers/APIError');
// require('console-stamp')(console, '[HH:MM:ss.l]');

const app = express();

// set enable logger for development mode
if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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

app.use('/static', express.static('public'));

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressconstidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({ message: 'Page Not Found' });
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

module.exports = app;