import express from 'express'
import apiCtrl from './api.controller'
import walletRoute from './wallet/wallet.route'

const router = express.Router()

// server api information
router.get('/info', apiCtrl.info)

// bitcoin api
router.get('/btc/status', apiCtrl.BTCStatus)
// router.get('/btc/address/:addr', apiCtrl.FindBitcoinAddressSummary)
router.get('/btc/tx/:txid', apiCtrl.FindBitcoinTransactions)

// mount wallet at /wallet
router.use('/wallet', walletRoute)

module.exports = router