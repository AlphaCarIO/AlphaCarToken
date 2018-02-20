const BigNumber = require('bignumber.js');
const utils = require('./utils')
const AlphaCarToken = artifacts.require('AlphaCarToken')
const Crowsale = artifacts.require("./CrowsaleMock")

const cc = require('./constants')

let token
let crowsale
let wallet
let token_owner
let crowsale_owner

contract('Crowsale', function (accounts) {
  beforeEach(async () => {
    wallet = accounts[5]
    token_owner = accounts[0]
    crowsale_owner = accounts[0]
    token = await AlphaCarToken.new({from: token_owner})
    console.log('token.address:', token.address)
    crowsale = await Crowsale.new(wallet, token.address, {from: crowsale_owner})
  })

  it('do crowdsales before ICO', async () => {
    
    await crowsale.setNow(cc.PREICO_START_DATE_P1 - 1, {from: crowsale_owner})

    var _now = await crowsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.PREICO_START_DATE_P1 - 1, "unexpected time for now!")
    
    await utils.expectThrow(crowsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      to: token.address, value: web3.toWei("1", "Ether")}));

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(accounts[0])
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")

  })

  it('do crowdsales in ICO. at the beginning of ICO', async () => {

    await crowsale.setNow(cc.ICO_START_DATE, {from: crowsale_owner})

    var _now = await crowsale.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.ICO_START_DATE, "unexpected time for now!")

    await utils.expectThrow(crowsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")}));

    await crowsale.whitelist(accounts[1], {from: crowsale_owner});

    crowsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});
    
    /*
    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 2")
    */
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