const BigNumber = require('bignumber.js');
const utils = require('./utils')
const AlphaCarToken = artifacts.require('AlphaCarToken')
const Crowdsale = artifacts.require("./ACARCrowdsaleMock")

const cc = require('./constants')

let token
let crowsale

let wallet
let token_wallet
let crowdsale_owner

contract('Crowdsale', function (accounts) {
  beforeEach(async () => {
    wallet = accounts[5]
    token_wallet = accounts[0]
    crowdsale_owner = accounts[4]
    token = await AlphaCarToken.new({from: token_wallet})
    console.log('token.address:', token.address)
    crowdsale = await Crowdsale.new(cc.rate, wallet, token.address, token_wallet,
      cc.cap, cc.START_DATE, cc.END_DATE, {gas: cc.gas_amt, from: crowdsale_owner})
    console.log('crowdsale.address:', crowdsale.address)

    await token.approve(crowdsale.address, cc.cap, {from: token_wallet});
  })

  it('do crowdsales before ICO', async () => {
    
    await crowdsale.setNow(cc.START_DATE - 1, {from: crowdsale_owner})

    var _now = await crowdsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.START_DATE - 1, "unexpected time for now!")
    
    await utils.expectThrow(crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      value: web3.toWei("1", "Ether")}));

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")

  })

  it('do crowdsales in ICO. at the beginning of ICO. reapprove!', async () => {

    await token.approve(crowdsale.address, (cc.tokenpether - 1) * cc.ONE, {from: token_wallet});

    await crowdsale.setNow(cc.START_DATE, {from: crowdsale_owner})

    _now = await crowdsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.START_DATE, "unexpected time for now!")
    
    await utils.expectThrow(crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      value: web3.toWei("1", "Ether")}));
    
    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")
    
  })

  it('do crowdsales in ICO. at the beginning of ICO', async () => {

    await crowdsale.setNow(cc.START_DATE, {from: crowdsale_owner})

    _now = await crowdsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.START_DATE, "unexpected time for now!")
    await crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});
    
    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.rate * cc.ONE, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.rate * cc.ONE).toNumber(), "step 2")
    
  })

  it('do crowdsales in ICO. at the end of ICO', async () => {

    await crowdsale.setNow(cc.END_DATE, {from: crowdsale_owner})

    _now = await crowdsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.END_DATE, "unexpected time for now!")

    await crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});

    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.rate * cc.ONE, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.rate * cc.ONE).toNumber(), "step 2")
    
  })

  it('do crowdsales after ICO.', async () => {

    await crowdsale.setNow(cc.END_DATE + 1, {from: crowdsale_owner});
    
    await utils.expectThrow(crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      value: web3.toWei("1", "Ether")}));

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")
    
  })
  
})