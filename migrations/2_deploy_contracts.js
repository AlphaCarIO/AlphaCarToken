var AlphaCarToken = artifacts.require("./AlphaCarToken.sol");

module.exports = function(deployer, network, accounts) {
  //console.log("deployer:", deployer)
  //deployer.network
  if (network == 'geth_dev') {
    console.log("migrate geth_dev...")
    deployer.deploy(AlphaCarToken, 
      {gas:5000000, gasPrice:50 * 10 ** 9, from: "0xbb65f9eb3a78ff3ebbc91e182ad9f3337b6329db"});
  } else {
    console.log("migrate others...")
    
    deployer.deploy(AlphaCarToken,
      {gas:5000000, gasPrice:50 * 10 ** 9, from: "0x02608F7C2cf8AC9bB6B3F6B0c581AA590F21F48d"}).then(function() {
        console.log('AlphaCarToken address:', AlphaCarToken.address);
      });
    
  }
};
