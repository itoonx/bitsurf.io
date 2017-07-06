import blockchains from '../broker'

const getTransactionByTransactionID = (txid) => {
  var rawtransactions = null
  var decodedtransactions = null
  var inputobjects = null
  var prev_out = null
  var serialized = null
  var total_sent = 0
  var total_received = 0
  return new Promise((resolve, reject) => {
    getRawTransaction(txid).then((res) => { rawtransactions = res })
      .then(() => decodeRawTransaction(rawtransactions).then((res) => { decodedtransactions = res }))
      .then(() => getInputTransactions(decodedtransactions).then((res) => { inputobjects = res }))
      .then(() => getPrevOutputFromInputTx(inputobjects).then((res) => { prev_out = res }))
      // .then(() => serializeTransactions(decodedtransactions).then((res) => { serialized = res }))
      // .then(() => getOutputBalance(decodedtransactions).then((res) => { serialized = res }))
      .then(() => {
        // console.log(prevout)
        resolve(prev_out)
      })
  })
}


const startProcess = (prev_out) => {
  return new Promise((resolve, reject) => {
    Promise.all(prev_out).then((val) => {
      resolve(val)
    })
  })
}

const getPrevMapped = (vout_tx, vout_number, txid) => {
  var prev_out = []
  return new Promise((resolve, reject) => {
    vout_tx.map((outx) => {
      if ( vout_number == outx.n ) {
        prev_out.push({ txid, prev_out: outx })
      }
    })
    resolve(prev_out)
  })
}

const getPrevOutputFromInputTx = (inputobjects) => {
  var rawtransactions = null
  var decodedtransactions = null
  var outx = null
  return new Promise((resolve, reject) => {
    inputobjects.map((tx) => {
      var vout_number = tx.vout
      getRawTransaction(tx.txid).then((res) => { rawtransactions = res })
        .then(() => decodeRawTransaction(rawtransactions).then((res) => { decodedtransactions = res }))
        .then(() => getOutputTransactions(decodedtransactions).then((res) => { outx = res }))
        .then(() => getPrevMapped(outx, vout_number, tx.txid).then((res) => {
          startProcess(res).then((prevobject) => {
            resolve(prevobject)
          })
        }))
    })
  })
}

const serializeTransactions = (transactionobject) => {
  var txheader = []
  transactionobject.map((tx, index) => {
    txheader.push({
      version: tx.version,
      hash: tx.hash,
      confirmations: tx.confirmations,
      lock_time: tx.locktime,
      time: tx.time,
      block_time: tx.blocktime,
      size: tx.size,
      vsize: tx.vsize,
      blockhash: tx.blockhash
    })
  })
  return Promise.resolve(txheader)
}

const getOutputBalance = (transactionobject) => {
  return new Promise((resolve) => {
    let OutputBalance = 0;
    transactionobject.forEach((tx) => {
      tx.vout.forEach((outx) => {
        OutputBalance += outx.value;
      })
    })
    resolve(OutputBalance)
  })
}

const getInputTransactions = (transactionobject) => {
  let inputs = []
  return new Promise((resolve) => {
    transactionobject.vin.map((vin_tx) => {
      inputs.push(vin_tx)
    })
    resolve(inputs)
  })
}

const getOutputTransactions = (transactionobject) => {
  let outputs = []
  return new Promise((resolve) => {
    transactionobject.vout.map((vout_tx) => {
      outputs.push(vout_tx);
    })
    resolve(outputs)
  })
}

const searchRawTransaction = (addr) => {
  return new Promise((resolve, reject) => {
    blockchains.bitcoin.searchrawtransactions(addr, (err, response) => {
      if (err) return reject(err)
      resolve(JSON.parse(response))
    })
  })
}

const getRawTransaction = (txid) => {
  return new Promise((resolve, reject) => {
    blockchains.bitcoin.getrawtransaction(txid, (err, response) => {
      if (err) return reject(err)
      resolve(JSON.parse(response))
    })
  })
}

const decodeRawTransaction = (txid) => {
  return new Promise((resolve, reject) => {
    blockchains.bitcoin.decoderawtransaction(txid, (err, response) => {
      if (err) return reject(err)
      resolve(JSON.parse(response))
    })
  })
}

module.exports = { getTransactionByTransactionID }