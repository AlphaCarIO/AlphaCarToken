var AlphaCarToken = artifacts.require("./AlphaCarToken.sol");

module.exports = function(deployer, network, accounts) {
  //console.log("deployer:", deployer)
  //deployer.network
  if (network == 'geth_dev') {
    console.log("migrate geth_dev...")
    deployer.deploy(AlphaCarToken, "ACAR", "Alpha Car Token", "0xbca685cb5dfd40658eabe435c56559915aa1b815", 
      {gas:5000000, gasPrice:50 * 10 ** 9, from: "0xbb65f9eb3a78ff3ebbc91e182ad9f3337b6329db"});
  } else {
    console.log("migrate others...")
    deployer.deploy(AlphaCarToken, "ACAR", "Alpha Car Token", "0xeF729e3e42c757e88aFB2C910C619b3aDf4472e6",
      {gas:5000000, gasPrice:50 * 10 ** 9, from: "0x02608F7C2cf8AC9bB6B3F6B0c581AA590F21F48d"});
  }
};
