const express = require('express');
const walletCtrl = require('./wallet.controller');
const expressJoi = require('express-joi');
const validatorSchema = require('../../validator/');

const router = express.Router();

router.post('/create/btc', expressJoi.joiValidate(validatorSchema.createWallet), walletCtrl.bitcoin.createBTCAddress);

router.get(walletCtrl.bitcoin.listBTCAddress);

module.exports = router;