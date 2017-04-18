var express = require('express');
var apiCtrl = require('./api.controller');

const router = express.Router();

router.get('/info', apiCtrl.info);

router.get('/network/btc', apiCtrl.BTCStatus);

module.exports = router;