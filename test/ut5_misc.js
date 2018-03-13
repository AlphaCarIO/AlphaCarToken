const BigNumber = require('bignumber.js');
const utils = require('./utils')
const AlphaCarToken = artifacts.require('AlphaCarToken')
const Crowdsale = artifacts.require("./ACTCrowdsaleMock")

const cc = require('./constants')

let token
let crowsale

let wallet
let token_owner
let crowdsale_owner

let test_acc

contract('AlphaCarToken', function (accounts) {
  beforeEach(async () => {
    wallet = accounts[5]
    token_owner = accounts[0]
    test_acc = accounts[3]
    crowdsale_owner = accounts[4]
    token = await AlphaCarToken.new({from: token_owner})
    console.log('token.address:', token.address)
    crowdsale = await Crowdsale.new(cc.tokenpether, wallet, token.address, token_owner,
      cc.cap, cc.START_DATE, cc.END_DATE, {gas: cc.gas_amt, from: crowdsale_owner})
      console.log('crowdsale.address:', crowdsale.address)

    await token.approve(crowdsale.address, cc.cap, {from: token_owner});

  })
  
  it('change ownership', async () => {
    
    await token.transferOwnership(test_acc, {gas: cc.gas_amt, from: token_owner});
    
    await utils.expectThrow(token.transferOwnership(token_owner, {gas: cc.gas_amt, from: token_owner}));
    
    await token.transferOwnership(token_owner, {gas: cc.gas_amt, from: test_acc});
    
  })

  it('burn totalSupply', async() => {
    
    await token.burn(cc.ONE, {gas: cc.gas_amt, from: token_owner})

    balance = await token.balanceOf.call(token_owner)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.ONE).toNumber(), "step 1")

    totalSupply_ = await token.totalSupply.call()
    assert.strictEqual(totalSupply_.toNumber(), cc.total.minus(cc.ONE).toNumber(), "step 2")

  })
  
})