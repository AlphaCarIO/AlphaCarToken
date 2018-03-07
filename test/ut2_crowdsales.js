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

    await token.setNow(cc.START_DATE - 1)

    _now = await token.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.START_DATE - 1, "1 unexpected time for now!")

    await utils.expectThrow(token.buyTokens(accounts[1], {gas: cc.gas_amt,
      from: accounts[1], value: web3.toWei("1", "Ether")}));

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")

  })

  it('do crowdsales in ICO. at the beginning of ICO', async () => {

    await token.setNow(cc.START_DATE)

    _now = await token.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.START_DATE, "2 unexpected time for now!")

    token.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 2")
    
  })

  it('do crowdsales in ICO. at the end of ICO', async () => {

    await token.setNow(cc.END_DATE)

    token.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});

    _now = await token.getNow.call()
    assert.strictEqual(_now.toNumber(), cc.END_DATE, "unexpected time for now!")

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 2")
    
  })

  it('do crowdsales after ICO.', async () => {

    await token.setNow(cc.END_DATE + 1);

    await utils.expectThrow(token.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], 
      value: web3.toWei("1", "Ether")}));

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2")
    
  })
  
})