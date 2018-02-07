module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // contracts_build_directory: "./build",
  networks: {
    /*
    ropsten: {
      network_id: 3,    // Official ropsten network id
      host: '128.199.120.45',
      port: 8545,
      gas: 4712388,
      gasPirce: 200000000000,
      from: '0xe0a46b5ea4c6e6e1349c0c0e62050410054f9f27'
    },
    */
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
