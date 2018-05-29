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
    console.log(token.address)

    crowdsale = await Crowdsale.new(cc.tokenpether, wallet, token.address, token_wallet,
      cc.cap, cc.START_DATE, cc.END_DATE, {gas: cc.gas_amt, from: crowdsale_owner})

    await token.approve(crowdsale.address, cc.cap, {from: token_wallet});

    await crowdsale.setNow(cc.START_DATE, {from: crowdsale_owner});
    await crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});
    
    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(token_wallet)
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

    await crowdsale.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")});

    var balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 5")

    var balance = await token.balanceOf.call(accounts[2])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 6")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(2 * cc.tokenpether * cc.ONE).toNumber(), "step 7")

  })
  
})