module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // contracts_build_directory: "./build",
  networks: {
    ropsten: {
      network_id: 3,    // Official ropsten network id
      host: '127.0.0.1',
      port: 8545,
      gas: 3000000,
      gasPirce: 1e+9,
      from: '0x2ac91344e9f023954dfe88efd5f7770db85eaba3'
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      gas: 0x989680,
      gasPrice: 50,
      network_id: "*",
    },
    geth_dev: {
      host: "127.0.0.1",
      port: 8545,
      /*provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/");
      },*/
      gas: 0x989680,
      network_id: "*",
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    useColors: true
  }
};
