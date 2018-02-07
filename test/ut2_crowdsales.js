const BigNumber = require('bignumber.js');
const utils = require('./utils')
const AlphaCarToken = artifacts.require('AlphaCarToken')
const TokenMock = artifacts.require("./TokenMock")

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

  it('do crowdsales before ICO', async () => {

    await token.setNow(cc.PREICO_START_DATE_P1 - 1)

    var _now = await token.getNowFromOwner.call()
    assert.strictEqual(_now.toNumber(), cc.PREICO_START_DATE_P1 - 1, "unexpected time for now!")

    await utils.expectThrow(token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      to: token.address, value: web3.toWei("1", "Ether")}));

    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")

  })

  it('do crowdsales in ICO. at the beginning of ICO', async () => {

    await token.setNow(cc.ICO_START_DATE)

    var _now = await token.getNowFromOwner.call()
    assert.strictEqual(_now.toNumber(), cc.ICO_START_DATE, "unexpected time for now!")

    await token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      to: token.address, value: web3.toWei("1", "Ether")});

    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 2")
    
  })

  it('do crowdsales in ICO. at the end of ICO', async () => {

    await token.setNow(cc.END_DATE)

    await token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
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
  
})