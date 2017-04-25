const express = require('express');
const expressJoi = require('express-joi');
const walletCtrl = require('./wallet.controller');
const validatorSchema = require('../../validator/');

const router = express.Router();

router.post('/btc/create', expressJoi.joiValidate(validatorSchema.createWallet), walletCtrl.bitcoin.createBTCAddress);

router.get('/btc/list', walletCtrl.bitcoin.listBTCAddress);

router.delete('/btc/:walletId', walletCtrl.bitcoin.removeBTCAddress);

router.param('walletId', walletCtrl.bitcoin.load);

module.exports = router;