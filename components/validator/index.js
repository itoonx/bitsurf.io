const expressJoi = require('express-joi');

const createWallet = {
  identity: expressJoi.Joi.types.String().alphanum().min(1).max(25),
  domain_key: expressJoi.Joi.types.String().alphanum().min(1).max(25),
  passphrase: expressJoi.Joi.types.String().min(2).max(100)
};

module.exports = {
    createWallet
}