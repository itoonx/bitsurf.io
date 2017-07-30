import blockchains from '../broker'

const getTransactionByTransactionID = async (txid) => {
  return new Promise((resolve, reject) => {
    processTransactions(txid).then((tx) => {
      resolve(tx)
    })
  });
}

const processTransactions = async (txid) => {
  var rawtx = await getRawTransaction(txid)
  var decoderawtx = await decodeRawTransaction(rawtx)
  var inputs = await getInputTransactions(decoderawtx)
  var outputs = await getOutputTransactions(decoderawtx)
  var sequence_n = await getSequenceNumberFromInputTx(inputs)
  var prev_out = await getPrevOutputFromInputTx(inputs, sequence_n)
  var vin_sz = await getInputSizeFromInputObjects(inputs)
  var vout_sz = await getOutputSizeFromOuputObjects(outputs)
  var serialized = await serializeTransactions(decoderawtx, prev_out, outputs)
  return new Promise((resolve, reject) => {
    resolve(serialized)
  })
}

const getOutputSizeFromOuputObjects = (outputobjects) => {
  let vin_sz = 0
  return new Promise((resolve, reject) => {
    outputobjects.map((outx) => {
      vin_sz += outx.n
    })
    resolve(vin_sz)
  })
}

const getInputSizeFromInputObjects = (inputobjects) => {
  let vout_sz = 0
  return new Promise((resolve, reject) => {
    inputobjects.map((inptx) => {
      vout_sz += inptx.vout
    })
    resolve(vout_sz)
  })
}

const getSentBalanceFromOutput = (inputobjects) => {
  var sentbalance = 0
  return new Promise((resolve, reject) => {
    inputobjects.map((inptx) => {
      console.log(inptx)
    })
  })
}

const getReceivedBalanceFromPrev = (prevoutobject) => {
  var receivedbalance = 0
  return new Promise((resolve, reject) => {
    prevoutobject.map((prevtx) => {
      receivedbalance += prevtx.prev_out.value
    })
    resolve(receivedbalance)
  });
}

const getSequenceNumberFromInputTx = (inputobjects) => {
  let sequence_number = []
  return new Promise((resolve, reject) => {
    inputobjects.map((inptx) => {
      sequence_number.push({ vout: inptx.vout, sequence: inptx.sequence})
    })
    resolve(sequence_number)
  })
}

const getPrevMapped = (vout_tx, sequenceobjects, vout_number, txid) => {
  var prevoutx = []
  return new Promise((resolve, reject) => {
    vout_tx.map((outx) => {
      if ( vout_number == outx.n ) {
        sequenceobjects.map((seqn) => {
          if ( seqn.vout == outx.n ) {
            prevoutx.push({ sequence: seqn.sequence, prev_out: outx })
          }
        })
      }
    })
    resolve(prevoutx)
  })
}

const getPrevOutputFromInputTx = (inputobjects, sequenceobjects) => {
  var rawtransactions = null
  var decodedtransactions = null
  var outx = null
  return new Promise((resolve, reject) => {
    var prevoutchunk = []
    inputobjects.map((tx) => {
      var vout_number = tx.vout
      getRawTransaction(tx.txid).then((res) => { rawtransactions = res })
        .then(() => decodeRawTransaction(rawtransactions).then((res) => { decodedtransactions = res }))
        .then(() => getOutputTransactions(decodedtransactions).then((res) => { outx = res }))
        .then(() => getPrevMapped(outx, sequenceobjects, vout_number, tx.txid).then((res) => {
          prevoutchunk.push(res[0])
          if ( inputobjects.length === prevoutchunk.length) {
            resolve(prevoutchunk)
          }
        }))
    })
  })
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

const serializeTransactions = (decodedtransactions, inputs, outputs) => {
  console.log(decodedtransactions)
  return new Promise((resolve, reject) => {
    var tx = {
      version: decodedtransactions.version,
      hash: decodedtransactions.hash,
      confirmations: decodedtransactions.confirmations,
      lock_time: decodedtransactions.locktime,
      time: decodedtransactions.time,
      block_time: decodedtransactions.blocktime,
      size: decodedtransactions.size,
      blockhash: decodedtransactions.blockhash,
      inputs: inputs,
      outputs: outputs
    }
    resolve(tx)
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

module.exports = { 
  getTransactionByTransactionID,
  getOutputSizeFromOuputObjects,
  getInputSizeFromInputObjects,
  getSentBalanceFromOutput,
  getReceivedBalanceFromPrev,
  getSequenceNumberFromInputTx,
  getPrevOutputFromInputTx,
  getOutputBalance,
  getInputTransactions,
  getOutputTransactions,
  searchRawTransaction ,
  getRawTransaction,
  decodeRawTransaction
}