import blockchains from '../broker'
import Transactions from './transactions'

const getSummaryAddress = async (addr) => {
  return new Promise((resolve, reject) => {
    processAddress(addr).then((summary_addr) => {
      resolve(summary_addr)
    })
  });
}

const getTransactionsFromAddress = async (rawaddr) => {
  var txs = []
  var n_tx = 0
  return new Promise((resolve, reject) => {
    rawaddr.map((tx, index) => {
      n_tx += 1
      let version = tx.version
      let hash = tx.hash
      let confirmations = tx.confirmations
      let lock_time = tx.locktime
      let time = tx.time
      let block_time = tx.blocktime
      let size = tx.size
      let blockhash = tx.blockhash
      txs.push({ version, hash, confirmations, lock_time, time, block_time, size, blockhash })
      if (rawaddr.length === index+1) {
        resolve({ n_tx: n_tx, txs: txs })
      }
    })
  })
}

const scriptSig = () => {

}

const ripemd160 = (rawaddr) => {
  return new Promise((resolve, reject) => {
    rawaddr.map((tx, index) => {
      // tx.vout
      // console.log(tx.vout)
      tx.vout.map((vout) => {
        // if ( scriptSig)
        console.log(vout.scriptPubKey);
      })
    })
  })
}

const getReceiveBalance = (rawaddr) => {
  var satoshi_balance = 0
  return new Promise((resolve, reject) => {
    rawaddr.map((tx, index) => {
      // tx.vout
      // console.log(tx.vout)

    })
  })
}

const getSentBalance = () => {

}

const getFinalBalance = () => {

}


const processAddress = async (addr) => {
  var rawaddr = await Transactions.searchRawTransaction(addr)
  var txs = await getTransactionsFromAddress(rawaddr)
  // var receive = await getReceiveBalance(rawaddr)
  var hash160 = await ripemd160(rawaddr)

  return new Promise((resolve, reject) => {
    resolve(hash160)
  })
}

module.exports = { getSummaryAddress }
