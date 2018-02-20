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
  
  it('change ownership', async () => {

    await token.setStartDate(cc.ICO_START_DATE - 1);
    
    await token.transferOwnership(accounts[4]);
    
    await utils.expectThrow(token.setStartDate(cc.ICO_START_DATE));

    await token.setStartDate(cc.ICO_START_DATE - 1, {from: accounts[4]});

    startDate = await token.startDate.call();

    assert.strictEqual(startDate.toNumber(), cc.ICO_START_DATE - 1, "step 1");

    await utils.expectThrow(token.transferOwnership(accounts[3]));

    token.transferOwnership(accounts[3], {from: accounts[4]});
    
  })
  
})