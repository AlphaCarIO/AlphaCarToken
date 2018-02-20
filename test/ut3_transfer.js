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

    await token.setNow(cc.ICO_START_DATE);

    await token.whitelist(accounts[1]);

    await token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});
    
    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 2")

  })
  
  it('transfer after ico', async () => {
    
    token.transfer(accounts[2], cc.ONE, {from: accounts[1]})

    await utils.expectThrow(token.transfer(accounts[2], cc.tokenpether * cc.ONE, {from: accounts[1]}))

    token.transfer(accounts[2], (cc.tokenpether - 1) * cc.ONE, {from: accounts[1]})

    var balance = await token.balanceOf.call(accounts[2])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 3")

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 0, "step 4")

    await token.proxyPayment(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});

    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 5")

    var balance = await token.balanceOf.call(accounts[2])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 6")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(2 * cc.tokenpether * cc.ONE).toNumber(), "step 7")

  })
  
})