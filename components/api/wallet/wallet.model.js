const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
    index: true,
    unique: true
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
  list: (start = 0, limit = 50) => {
    console.log(`Start ${start} and limit ${limit}`);
  }
}

module.exports = mongoose.model('Wallet', WalletSchema);