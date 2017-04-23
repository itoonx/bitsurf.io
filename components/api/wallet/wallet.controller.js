const httpStatus = require('http-status');
const redis = require('redis');
const rsclient = redis.createClient();
const bitcoinjs = require('bitcoinjs-lib');
const bigi = require('bigi');
const WalletSchema = require('./wallet.model');
const Currency = require('../../constants/currencyTypes');

const bitcoin = {

  load: (req, res, next, id) => {
    WalletSchema.getWalletById(id)
      .then((wallet) => {
        req.wallet = wallet; // eslint-disable-line no-param-reassign
        return next();
      })
      .catch(e => next(e));
  },

  createBTCAddress: (req, res, next) => {
    const body = req.body;
    const passphrase = bitcoinjs.crypto.sha256(body.passphrase);
    const d = bigi.fromBuffer(passphrase);
    const keyPair = new bitcoinjs.ECPair(d);
    const wifKey = keyPair.toWIF();
    const address = keyPair.getAddress();

    const wallet = new WalletSchema({
      userIdentity: body.identity,
      type: Currency.BTC,
      addressName: 'My BTC Wallet',
      WIFKey: wifKey,
      address: address
    });

    wallet.save((err, callback) => {
      if (err) throw err;
      res.status(httpStatus.OK).json({ wifKey, address });
    });
  },

  listBTCAddress: (req, res, next) => {
    const { limit = 50, skip = 0 } = req.query;
    WalletSchema.list({ limit, skip })
      .then(callback => res.json(callback))
      .catch(e => next(e));
  },

  removeBTCAddress: (req, res, next) => {
    const wallet = req.wallet;
    wallet.remove()
      .then(callback => res.json(callback))
      .catch(e => next(e));
  }
}

module.exports = {
  bitcoin
};