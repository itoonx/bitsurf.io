import blockchains from '../broker'
import Transactions from './transactions'

const getSummaryAddress = async (addr) => {
  return new Promise((resolve, reject) => {
    processAddress(addr).then((summary_addr) => {
      resolve(summary_addr)
    })
  });
}

// const reconstructRawAddress = async (rawaddr) => {
//   var txs = []
//   return new Promise((resolve, reject) => {
//     rawaddr.map((tx, index) => {
//       // Transactions.serializeTransactions(tx)
//       // Transactions.getTransactionByTransactionID(tx.txid)
//       //   .then((retx) => {
//       //     txs.push(retx)
//       //     if (rawaddr.length === index+1) {
//       //       resolve(txs)
//       //     }
//       //   })
//     })
//   })
// }

const processAddress = async (addr) => {
  var rawaddr = await Transactions.searchRawTransaction(addr)
  // var reconst = await reconstructRawAddress(rawaddr)

  return new Promise((resolve, reject) => {
    resolve(rawaddr)
  })
}

module.exports = { getSummaryAddress }

