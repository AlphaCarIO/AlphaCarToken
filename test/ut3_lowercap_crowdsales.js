const BigNumber = require('bignumber.js');
const utils = require('./utils')
const AlphaCarToken = artifacts.require('AlphaCarToken')
const Crowdsale = artifacts.require("./ACARCrowdsaleMock")

const cc = require('./constants')

let token
let crowsale
let test_acc

let wallet
let token_wallet
let crowdsale_owner

contract('Crowdsale', function (accounts) {
  beforeEach(async () => {
    wallet = accounts[5]
    token_wallet = accounts[0]
    crowdsale_owner = accounts[4]

    test_acc = accounts[1]

    token = await AlphaCarToken.new({from: token_wallet})
    console.log('token.address:', token.address)
    crowdsale = await Crowdsale.new(cc.rate, wallet, token.address, token_wallet,
      cc.lower_cap, cc.START_DATE, cc.END_DATE, {gas: cc.gas_amt, from: crowdsale_owner})
    console.log('crowdsale.address:', crowdsale.address)

    await token.approve(crowdsale.address, cc.lower_cap, {from: token_wallet});

    var remainingTokens = await crowdsale.remainingTokens.call()
    assert.strictEqual(remainingTokens.toNumber(), cc.lower_cap.toNumber(), "unexpected time for now!")
  })

  it('do crowdsales in ICO. at the beginning of ICO', async () => {

    await crowdsale.setNow(cc.START_DATE, {from: crowdsale_owner})

    _now = await crowdsale.getNow.call()
    console.log('at the beginning START_DATE', cc.START_DATE)
    assert.strictEqual(_now.toNumber(), cc.START_DATE, "unexpected time for now!")

    await crowdsale.buyTokens(test_acc, {gas: cc.gas_amt, from: test_acc, value: web3.toWei("1", "Ether")});
    
    balance = await token.balanceOf.call(test_acc)
    assert.strictEqual(balance.toNumber(), cc.rate * cc.ONE, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.rate * cc.ONE).toNumber(), "step 2")
    
  })

  it('do crowdsales in ICO. reach cap', async () => {

    await crowdsale.setNow(cc.START_DATE, {from: crowdsale_owner})

    _now = await crowdsale.getNow.call()
    console.log('at the beginning START_DATE', cc.START_DATE)
    assert.strictEqual(_now.toNumber(), cc.START_DATE, "unexpected time for now!")

    await crowdsale.buyTokens(test_acc, {gas: cc.gas_amt, from: test_acc, value: web3.toWei("10", "Ether")});
    
    balance = await token.balanceOf.call(test_acc)
    assert.strictEqual(balance.toNumber(), cc.rate * 10 * cc.ONE, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.rate * 10 * cc.ONE).toNumber(), "step 2")

    remainingTokens = await crowdsale.remainingTokens.call()
    assert.strictEqual(remainingTokens.toNumber(), 0, "it should have 0 token remaining!")

    weiRaised = await crowdsale.weiRaised.call()
    assert.strictEqual(weiRaised.toNumber(), 10 * cc.ONE, "10 eth raised!")

    cap = await crowdsale.cap.call()
    console.log('cap', cap.toNumber())
    assert.strictEqual(cap.toNumber(), cc.rate * 10 * cc.ONE, "10 eth raised!")

    capReached = await crowdsale.capReached.call()
    console.log('capReached', capReached)
    assert.strictEqual(capReached, true, "already reached the cap! should be true")
    
  })
  
})