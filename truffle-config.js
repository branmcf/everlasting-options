const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env.DEVELOPMENT_MNEMONIC
require('dotenv').config();

module.exports = {
  networks: {
    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${process.env.DEVELOPMENT_INFURA_PROJECT_ID}`),
      network_id: '1',
      // gas: 1100000,
      gasPrice: 25000000000,
      // gas: 8000000
      // gas: 5000000,
      // gasPrice: 10000000000
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${process.env.DEVELOPMENT_INFURA_PROJECT_ID}`),
      network_id: '42',
      //  gas: 12487794
      //  gas: 12500000
      gasPrice: 25000000000,
      // gas: 12500000,
    },
    development: {
      host: "127.0.0.1",
      port: "8546",
      network_id: "*",
      gasPrice: 1e6,
      from: process.env.DEVELOPMENT_ADDRESS
    }
  },
  mocha: {
    enableTimeouts: false
  },
  compilers: {
    solc: {
      version: "0.4.24",
      optimizer: {
        enabled: true,
        runs: 200
    }
    },

  }
}
