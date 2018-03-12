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

contract('Crowsale', function (accounts) {
  beforeEach(async () => {
    wallet = accounts[5]
    token_owner = accounts[0]
    crowdsale_owner = accounts[4]
    token = await AlphaCarToken.new({from: token_owner})
    console.log('token.address:', token.address)
    crowdsale = await Crowdsale.new(cc.tokenpether, wallet, token.address, token_owner,
      cc.cap, cc.START_DATE, cc.END_DATE, {from: crowdsale_owner})
      console.log('crowdsale.address:', crowdsale.address)

    await token.approve(crowdsale.address, cc.cap, {from: token_owner});
  })

  it('do crowdsales before ICO', async () => {
    
    await crowdsale.setNow(cc.START_DATE - 1, {from: crowdsale_owner})

    var _now = await crowdsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.START_DATE - 1, "unexpected time for now!")
    
    await utils.expectThrow(crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      to: token.address, value: web3.toWei("1", "Ether")}));

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(token_owner)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")

  })

  
  it('do crowdsales in ICO. at the beginning of ICO', async () => {

    await crowdsale.setNow(cc.START_DATE, {from: crowdsale_owner})

    var _now = await crowdsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.START_DATE, "unexpected time for now!")

    crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});
    
    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(token_owner)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 2")
    
  })
/*
  it('do crowdsales in ICO. at the end of ICO', async () => {

    await token.setNow(cc.END_DATE)

    await utils.expectThrow(token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      to: token.address, value: web3.toWei("1", "Ether")}));

    await token.whitelist(accounts[1]);

    token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      to: token.address, value: web3.toWei("1", "Ether")});

    var _now = await token.getNowFromOwner.call()
    assert.strictEqual(_now.toNumber(), cc.END_DATE, "unexpected time for now!")

    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 2")
    
  })

  it('do crowdsales after ICO.', async () => {

    await token.setNow(cc.END_DATE + 1);

    await utils.expectThrow(token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      to: token.address, value: web3.toWei("1", "Ether")}));

    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")
    
  })
  */
})