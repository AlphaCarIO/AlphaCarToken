const BigNumber = require('bignumber.js');
const utils = require('./utils')
const AlphaCarToken = artifacts.require('AlphaCarToken')
const TokenMock = artifacts.require("./TokenMock");

const cc = require('./constants')

let token
let wallet

// accounts[0] = Contract Owner
// accounts[1] = test account
// accounts[2] = test account
// accounts[5] = WALLET_ACCOUNT

contract('AlphaCarToken', function (accounts) {
  beforeEach(async () => {
    wallet = accounts[5]
    token = await TokenMock.new(cc.symbol, wallet, {from: accounts[0]})
    console.log(token.address)

  })
  
  it('add to whitelist', async () => {

    await token.whitelist(accounts[2]);

    var acc_arr = [];

    var count = 100;

    for (var i = 0; i < count; i++) {
      acc_arr.push(accounts[2]);
    }

    await token.batchWhitelist(acc_arr);
    
    for (var i = 0; i < count; i++) {
      await token.whitelist(accounts[2]);
    }
    
  })
  
})