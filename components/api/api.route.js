var express = require('express');
var apiCtrl = require('./api.controller');
var walletRoute = require('./wallet/wallet.route');

const router = express.Router();

// server api information
router.get('/info', apiCtrl.info);

router.get('/networks/btc', apiCtrl.BTCStatus);


// mount wallet at /wallet
router.use('/wallet', walletRoute);

module.exports = router;