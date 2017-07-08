import bitcoinrpc from 'bitcoin'
import fullnode from '../config/fullnode.config'

function getBitcoinRPCConnection (connection) {
  const client = new bitcoinrpc.Client({
    host: fullnode.btc.live,
    user: fullnode.btc.rpcuser,
    pass: fullnode.btc.rpcpassword,
    port: fullnode.btc.rpcport,
    timeout: fullnode.btc.rpctimeout
  })
  connection(client)
}

const bitcoin = {
  connect: (callback) => {
    getBitcoinRPCConnection((connected) => {
      callback(null, connected)
    })
  },

  getinfo: () => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getinfo', (err, info) => {
        if (err) return callback(err, null)
        let infoJSON = JSON.stringify(info)
      })
    })
  },

  getrawtransaction: (txid, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getrawtransaction', txid, (err, response) => {
        if (err) return callback(err, null)
        let getrawtransaction = JSON.stringify(response)
        callback(null, getrawtransaction)
      })
    })
  },

  decoderawtransaction: (hex, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('decoderawtransaction', hex, (err, response) => {
        if (err) return callback(err, null)
        let decoderawtransaction = JSON.stringify(response)
        callback(null, decoderawtransaction)
      })
    })
  },

  searchrawtransactions: (address, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('searchrawtransactions', address, (err, response) => {
        if (err) return callback(err, null)
        let searchrawtransactions = JSON.stringify(response)
        callback(null, searchrawtransactions)
      })
    })
  },

  getblock: (blockhash) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getblock', blockhash, (err, response) => {
        if (err) return callback(err, null)
        let block = JSON.stringify(response)
        callback(null, block)
      })
    })
  },

  getrawmempool: () => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getrawmempool', false, (err, response) => {
        if (err) return callback(err, null)
        let rawmempool = JSON.stringify(response)
        callback(null, rawmempool)
      })
    })
  }

}

module.exports = { bitcoin }