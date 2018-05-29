//var web3 = require("web3");

const AlphaCarToken = artifacts.require('./AlphaCarToken.sol');
const ACARCrowdsaleMock = artifacts.require('./ACARCrowdsaleMock.sol');

module.exports = function(deployer, network, accounts) {

  if (network == "development") {
    const _openingTime = web3.eth.getBlock('latest').timestamp + 2;
    const _closingTime = _openingTime + 60;
    const _rate = new web3.BigNumber(60000);
    const _tokenWallet = accounts[0];
    const _wallet = accounts[1];
    console.log('_tokenWallet:', _tokenWallet);
    console.log('_wallet:', _wallet);

    const _cap = 20 * 10 ** 8 * 10 ** 18;

    //uint256 _rate, address _wallet, ERC20 _token, address _tokenWallet, uint256 _cap, uint256 _openingTime, uint256 _closingTime
    return null;
    return deployer
        .then(() => {
            console.log('before deployer.deploy(AlphaCarToken)');
            return deployer.deploy(AlphaCarToken);
        })
        .then(() => {
            console.log('AlphaCarToken.address:', AlphaCarToken.address);
            return deployer.deploy(
                ACARCrowdsaleMock,
                _rate,
                _wallet,
                AlphaCarToken.address,
                _tokenWallet,
                _cap,
                _openingTime,
                _closingTime
            );
        });

  } else {
    // Perform a different step otherwise.
  }

};