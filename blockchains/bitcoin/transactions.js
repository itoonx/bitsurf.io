import blockchains from '../broker'

const getTransactionByTransactionID = async(txid) => {
    return new Promise((resolve, reject) => {
        processTransactions(txid).then((tx) => {
            resolve(tx)
        })
    });
}

const processTransactions = async(txid) => {
    console.log('Searching txid = ', txid)
    var rawtx = await getRawTransaction(txid)
    var decoderawtx = await decodeRawTransaction(rawtx)
    var inputs = await getInputTransactions(decoderawtx)
    var outputs = await getOutputTransactions(decoderawtx)
    var sequence_n_obj = await getSequenceNumberFromInputTx(inputs)
    var prev_out = await getPrevOutputFromInputTx(inputs, sequence_n_obj)
        // var vin_sz = await getInputSizeFromInputObjects(inputs)
        // var vout_sz = await getOutputSizeFromOuputObjects(outputs)
        // var serialized = await serializeTransactions(decoderawtx, prev_out, outputs)
    return new Promise((resolve, reject) => {
        resolve(decoderawtx)
    })
}

const getOutputSizeFromOuputObjects = (outputs) => {
    let vin_sz = 0
    return new Promise((resolve, reject) => {
        outputs.map((outx) => {
            vin_sz += outx.n
        })
        resolve(vin_sz)
    })
}

const getInputSizeFromInputObjects = (inputs) => {
    let vout_sz = 0
    return new Promise((resolve, reject) => {
        inputs.map((inptx) => {
            vout_sz += inptx.vout
        })
        resolve(vout_sz)
    })
}

const getSequenceNumberFromInputTx = (inputs) => {
    let sequence_number = []
    return new Promise((resolve, reject) => {
        inputs.map((inptx) => {
            sequence_number.push({ vout: inptx.vout, sequence: inptx.sequence })
        })
        resolve(sequence_number)
    })
}

const getPrevMapped = (vout_tx, sequence_n_obj, vout_number) => {
    var prev_outx = []
    return new Promise((resolve, reject) => {

        vout_tx.map((outx, count) => {

            console.log('xx')

            var matched_n = 0
            if (vout_number == outx.n) {
                matched_n += 1

                sequence_n_obj.map((seqn) => {
                    if (seqn.vout == outx.n) {
                        prev_outx.push({ sequence: seqn.sequence, prev_out: outx })

                    }
                })

            }

        })


        // resolve(prevoutx)
    })
}

const getPrevOutputFromInputTx = (inputs, sequence_n_obj) => {

    var rawtx = null
    var decodedrawtx = null
    var outx = []

    return new Promise((resolve, reject) => {
        var txs_outputs = []
        inputs.map((tx) => {

            var txid = tx.txid
            var vout_number = tx.vout

            getRawTransaction(txid).then((res) => { rawtx = res })
                .then(() => decodeRawTransaction(rawtx).then((res) => { decodedrawtx = res }))
                .then(() => getOutputTransactions(decodedrawtx).then((res) => { outx = res }))
                .then(() => getPrevMapped(outx, sequence_n_obj, vout_number).then((res) => {

                    // console.log('output:', outx)

                    // txs_outputs.push(res[0])
                    // console.log(res[0])
                    // if ( inputs.length == txs_outputs.length) {
                    //   console.log(txs_outputs)
                    //   // resolve(txs_outputs)
                    // }

                }))
        })

    })
}

const getUnspentOutput = (txid, vout) => {
    return new Promise((resolve, reject) => {
        gettxout(txid, vout).then(unspent => resolve(unspent))
    })
}

const opcodeSpliter = (byte) => {
    return new Promise((resolve, reject) => {
        console.log(byte)
    })
}

// const getInputScriptSig = (tx) => {
//   return new Promise((resolve) => {
//     tx.vin.map((vin_tx) => {

//       var buffer = vin_tx.scriptSig.hex
//       opcodeSpliter(buffer).then((opcode) => {

//       })
//       // console.log(buffer)

//     })
//   })
// }

const isCoinbase = (tx, callback) => {
    tx.vin.map((vin_tx) => {
        if (vin_tx.coinbase) {
            return callback(true)
        } else {
            return callback(false)
        }
    })
}

const getInputTransactions = (tx) => {
    let inputs = []
    return new Promise((resolve) => {
        var count_stage = 0
        tx.vin.map((vin_tx) => {

            isCoinbase(tx, (is_coinbase) => {
                if (is_coinbase) return resolve(vin_tx)

                getUnspentOutput(vin_tx.txid, vin_tx.vout).then((unspent) => {
                    if (!unspent) {
                        var is_spent = false
                    } else {
                        var is_spent = true
                    }

                    inputs.push({
                        txid: vin_tx.txid,
                        spent: is_spent,
                        vout: vin_tx.vout,
                        scriptSig: vin_tx.scriptSig,
                        sequence: vin_tx.sequence
                    })

                    count_stage += 1

                    if (tx.vin.length == count_stage) {
                        resolve(inputs)
                    }

                })

            })
        })
    })
}

const getOutputTransactions = (tx) => {
    let outputs = []
    return new Promise((resolve) => {
        tx.vout.map((vout_tx) => {
            outputs.push(vout_tx);
        })
        resolve(outputs)
    })
}

const serializeTransactions = (decodedtransactions, inputs, outputs) => {
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

const gettxout = (txid, vout) => {
    return new Promise((resovle, reject) => {
        var include_unconfirmed = true
        console.log('Get v_out = ', txid, vout, include_unconfirmed)
        blockchains.bitcoin.gettxout(txid, vout, include_unconfirmed, (err, response) => {
            if (err) return reject(err)
            resovle(response)
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
    getSequenceNumberFromInputTx,
    getPrevOutputFromInputTx,
    getUnspentOutput,
    getInputTransactions,
    getOutputTransactions,
    searchRawTransaction,
    getRawTransaction,
    gettxout,
    decodeRawTransaction
}