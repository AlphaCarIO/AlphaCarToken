const BigNumber = require('bignumber.js');
const AlphaCarToken = artifacts.require('AlphaCarToken')

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
    token = await AlphaCarToken.new({from: accounts[0]})
    console.log(token.address)
  })

  it('creation: should create an initial balance for the owner', async () => {
    var balance = await token.balanceOf.call(accounts[0])
    assert.strictEqual(balance.toNumber(), cc.total.toNumber(), "step 2: balance should be "+ cc.total +"!")
    balance = await token.balanceOf.call(accounts[5])
    assert.strictEqual(balance.toNumber(), 0, "step 2: balance should be 0!")
  })

  it('creation: test correct setting of basic information', async () => {
    const name = await token.name.call()
    assert.strictEqual(name, 'AlphaCar Token')

    const decimals = await token.decimals.call()
    assert.strictEqual(decimals.toNumber(), cc.DECIMALS)

    const symbol = await token.symbol.call()
    assert.strictEqual(symbol, cc.symbol)

    const totalSupply = await token.totalSupply.call()
    assert.strictEqual(totalSupply.toNumber(), cc.total.toNumber())

  })
  
})