import httpStatus from 'http-status'
import redis from 'redis'
import config from '../../config/environments'

import bitcoinAddress from '../../blockchains/bitcoin/addresses'
import BitcoinTransactions from '../../blockchains/bitcoin/transactions'

// const rsclient = redis.createClient()

const BITCOIN_ERROR_MESSAGE = { 
  message: 'Oop! something went wrong !'
}

const info = (req, res, next) => {
  res.status(httpStatus.OK).json({
    status: 'ok',
    date: new Date(),
    version: 1,
    environment: config.env
  })
}

const BTCStatus = (req, res, next) => {
  // rsclient.get('bitcoinstatus', function(err, reply) {
  //   res.status(httpStatus.OK).json( JSON.parse(reply) )
  //   console.log(reply)
  // })
}

const FindBitcoinAddressSummary = (req, res, next) => {
  const addr = req.params.addr
  bitcoinAddress.getSummaryAddress(addr)
    .then((response) => {
      return res.json(response).status(200)
    }).catch((err) => {
      return res.json(BITCOIN_ERROR_MESSAGE).status(401)
    })
}

const FindBitcoinTransactions = (req, res, next) => {
  const txid = req.params.txid
  BitcoinTransactions.getTransactionByTransactionID(txid)
    .then((response) => { 
      return res.json(response).status(200)
    }).catch((err) => {
      return res.json(BITCOIN_ERROR_MESSAGE).status(401)
    })
}

module.exports = { info, BTCStatus, FindBitcoinAddressSummary, FindBitcoinTransactions }
