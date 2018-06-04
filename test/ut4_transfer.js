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
let test_acc
let test_acc2

contract('Crowdsale', function (accounts) {
  beforeEach(async () => {
    wallet = accounts[5]
    token_wallet = accounts[0]
    crowdsale_owner = accounts[4]
    test_acc = accounts[1]
    test_acc2 = accounts[2]

    token = await AlphaCarToken.new({from: token_wallet})
    console.log(token.address)

    crowdsale = await Crowdsale.new(cc.rate, wallet, token.address, token_wallet,
      cc.cap, cc.START_DATE, cc.END_DATE, {gas: cc.gas_amt, from: crowdsale_owner})

    await token.approve(crowdsale.address, cc.cap.mul(cc.rate), {from: token_wallet});

    await crowdsale.setNow(cc.START_DATE, {from: crowdsale_owner});
    await crowdsale.buyTokens(test_acc, {gas: cc.gas_amt, from: test_acc, value: web3.toWei("1", "Ether")});
    
    var balance = await token.balanceOf.call(test_acc)
    assert.strictEqual(balance.toNumber(), cc.rate * cc.ONE, "step 1")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.rate * cc.ONE).toNumber(), "step 2")

  })
  
  it('transfer after ico', async () => {

    token.transfer(test_acc2, cc.ONE, {from: test_acc})

    await utils.expectThrow(token.transfer(test_acc2, cc.rate * cc.ONE, {from: test_acc}))

    token.transfer(test_acc2, (cc.rate - 1) * cc.ONE, {from: test_acc})

    var balance = await token.balanceOf.call(test_acc2)
    assert.strictEqual(balance.toNumber(), cc.rate * cc.ONE, "step 3")

    balance = await token.balanceOf.call(test_acc)
    assert.strictEqual(balance.toNumber(), 0, "step 4")

    await crowdsale.buyTokens(test_acc, {gas: cc.gas_amt, from: test_acc, value: web3.toWei("1", "Ether")});

    var balance = await token.balanceOf.call(test_acc)
    assert.strictEqual(balance.toNumber(), cc.rate * cc.ONE, "step 5")

    var balance = await token.balanceOf.call(test_acc2)
    assert.strictEqual(balance.toNumber(), cc.rate * cc.ONE, "step 6")

    balance = await token.balanceOf.call(token_wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(2 * cc.rate * cc.ONE).toNumber(), "step 7")

  })
  
})