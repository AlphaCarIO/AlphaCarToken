const BigNumber = require('bignumber.js');

const symbol = "ACAR";
const tokenpether = 60000;

const DECIMALS = 18;
const ONE = 10 ** DECIMALS;
const total = BigNumber(100 * 10 ** 8 * ONE);
const amt = BigNumber(100000 * ONE);
const amt1 = BigNumber(10000 * ONE);

const day = 86400;

const START_DATE = 1521936000;
const END_DATE = 1522511999;

const gas_amt = 150000;

module.exports = {
    symbol,
    ONE,
    DECIMALS,
    tokenpether,
    total,
    amt,
    amt1,
    day,
    START_DATE,
    END_DATE,
    gas_amt
}