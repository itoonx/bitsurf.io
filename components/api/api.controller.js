import httpStatus from 'http-status'
import redis from 'redis'
import config from '../../config/environments'
// import bitcoinAddress from '../../blockchains/bitcoin/addresses'
import BitcoinTransactions from '../../blockchains/bitcoin/transactions'

const rsclient = redis.createClient()

const info = (req, res, next) => {
  res.status(httpStatus.OK).json({
    status: 'ok',
    date: new Date(),
    version: 1,
    environment: config.env
  })
}

const BTCStatus = (req, res, next) => {
  rsclient.get('bitcoinstatus', function(err, reply) {
    res.status(httpStatus.OK).json( JSON.parse(reply) )
    console.log(reply)
  })
}

// const FindBitcoinAddressSummary = (req, res, next) => {
//   const addr = req.params.addr
//   bitcoinAddress.SummaryAddress(addr, (err, summary_addr) => {
//     if ( err ) return res.json({ message: 'Oop! something went wrong !'})
//     return res.json({ address: addr, txs: summary_addr })
//   })
// }

const FindBitcoinTransactions = (req, res, next) => {
  const txid = req.params.txid
  const rawtransaction = null
  const decodedtransactions = null
  BitcoinTransactions.getTransactionByTransactionID(txid)
    .then((xx) => { 
      return res.json(xx)
    })
  
}

module.exports = { info, BTCStatus, FindBitcoinTransactions }
