const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const APIError = require('../../helpers/APIError');

const WalletSchema = new mongoose.Schema({
  userIdentity: {
    type: String,
    index: true
  },
  type: Number,
  domain_key: {
    type: String,
    index: true
  },
  passphrase: {
    type: String,
    index: true
  },
  addressName: String,
  WIFKey: String,
  address: String,
  final: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  available: { type: Number, default: 0 },
  totalSent: { type: Number, default: 0 },
  totalReceived: { type: Number, default: 0 },
  unconfirmBalance: { type: Number, default: 0 },
  unconfirmTx: { type: Number, default: 0 },
  ntx: { type: Number, default: 0 },
  transactions: [
    { txid: String },
    { confirmations: String },
    { amount: Number },
    { fee: Number },
    { status: Number },
    { createAt: { type: Date, default: new Date() } }
  ],
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

WalletSchema.plugin(uniqueValidator);

WalletSchema.statics = {

  getWalletById(id) {
    return this.findById(id)
      .exec()
      .then((callback) => {
        if (callback) {
          return callback;
        }
      })
      .catch(() => {
        const err = new APIError('No such wallet exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  

}

module.exports = mongoose.model('Wallet', WalletSchema);