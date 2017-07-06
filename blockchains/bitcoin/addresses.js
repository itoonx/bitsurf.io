import util from 'util'
import blockchains from '../broker'
import Transactions from './transactions'

export default class Addresses {

  viewAddress = (addr, callback) => {
    let txsummary = null
    let transactionobject = null
    let inputstransactions = null
    let outputstransactions = null

    // Transactions.searchRawTransaction(addr)
    //   .then((rawaddr) => transactionobject = rawaddr)
    //   .then(() => Transactions.getInputTransactions(transactionobject)).then((inputs) => { inputstransactions = inputs })
    //   .then(() => Transactions.getOutputTransactions(transactionobject)).then((outputs) => { outputstransactions = outputs })
    //   .then((res) => Transactions.serializeTransactions(res)).then((txheader) => { txsummary = txheader })
    //   .then(() => {
    //     // console.log(util.inspect(inputstransactions))
    //     // Transactions.getPrevOutputFromInputTx(inputstransactions).then((previoustransactions) => { console.log(previoustransactions) })
    //   })
    //   .catch((err) => {
    //     console.log(`Error : ${util.inspect(err)}`)
    //   })
  }

  SummaryAddress = (addr, callback) => {
    viewAddress(addr, (err, response) => {

    })
  }

}

