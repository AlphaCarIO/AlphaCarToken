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

  })
  
  it('change ownership', async () => {

    await token.setStartDate(cc.START_DATE - 1);
    
    await token.transferOwnership(accounts[4]);
    
    await utils.expectThrow(token.setStartDate(cc.START_DATE));

    await token.setStartDate(cc.START_DATE - 1, {from: accounts[4]});

    startDate = await token.startDate.call();

    assert.strictEqual(startDate.toNumber(), cc.START_DATE - 1, "step 1");

    await utils.expectThrow(token.transferOwnership(accounts[3]));

    token.transferOwnership(accounts[3], {from: accounts[4]});
    
  })
  
  it('change wallet', async () => {

    await token.setNow(cc.START_DATE)
    
    await token.changeWallet(accounts[4])

    await token.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")})

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 1")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), 0, "step 2")

    balance = await token.balanceOf.call(accounts[4])
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 3")
    
  })
  
  it('change cap', async () => {
    
    await token.preAlloc(29999 * cc.ONE)

    CAP = await token.CAP.call()
    assert.strictEqual(CAP.toNumber(), cc.cap.toNumber(), "step 1")

    await token.setNow(cc.START_DATE)

    await token.buyTokens(accounts[1], {gas: cc.gas_amt, from: accounts[1], value: web3.toWei("1", "Ether")})

    getRemainingWei = await token.getRemainingWei.call()
    assert.strictEqual(getRemainingWei.toNumber(), 0, "step 2")

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), cc.tokenpether * cc.ONE, "step 3")

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.tokenpether * cc.ONE).toNumber(), "step 4")
    
  })

  it('burn cap', async() => {
    
    await token.burn(cc.ONE, {gas: cc.gas_amt, from: wallet})

    balance = await token.balanceOf.call(wallet)
    assert.strictEqual(balance.toNumber(), cc.total.minus(cc.ONE).toNumber(), "step 1")

    totalSupply_ = await token.totalSupply.call()
    assert.strictEqual(totalSupply_.toNumber(), cc.total.minus(cc.ONE).toNumber(), "step 2")

  })
  
})