import bitcoinrpc from 'bitcoin'
import fullnode from '../config/fullnode.config'

function getBitcoinRPCConnection (connection) {
  const client = new bitcoinrpc.Client({
    host: fullnode.btc.live,
    user: fullnode.btc.rpcuser,
    pass: fullnode.btc.rpcpassword,
    port: fullnode.btc.rpcport,
    timeout: fullnode.btc.rpctimeout
  });
  connection(client);
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
        const infoJSON = JSON.stringify(info)
        rsclient.set('bitcoinstatus', infoJSON.toString())
      })
    })
  },

  getrawtransaction: (txid, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getrawtransaction', txid, (err, response) => {
        if (err) return callback(err, null)
        const getrawtransaction = JSON.stringify(response)
        callback(null, getrawtransaction)
      })
    })
  },

  decoderawtransaction: (hex, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('decoderawtransaction', hex, (err, response) => {
        if (err) return callback(err, null)
        const decoderawtransaction = JSON.stringify(response)
        callback(null, decoderawtransaction)
      })
    })
  },

  searchrawtransactions: (address, callback) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('searchrawtransactions', address, (err, response) => {
        if (err) return callback(err, null)
        const searchrawtransactions = JSON.stringify(response)
        callback(null, searchrawtransactions)
      })
    })
  },

  getblock: (blockhash) => {
    getBitcoinRPCConnection((connected) => {
      connected.cmd('getblock', blockhash, (err, response) => {
        if (err) return callback(err, null)
      })
    })
  }

}

module.exports = { bitcoin };