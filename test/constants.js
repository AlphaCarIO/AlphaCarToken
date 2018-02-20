const BigNumber = require('bignumber.js');

const symbol = "ACAR";
const tokenpether = 60000;

const DECIMALS = 18;
const ONE = 10 ** DECIMALS;
const total = BigNumber(100 * 10 ** 8 * ONE);
const amt = BigNumber(100000 * ONE);
const amt1 = BigNumber(10000 * ONE);

const day = 86400;
const ICO_PERIOD = 30 * day;

const ICO_START_DATE = 1519862400;
const END_DATE = ICO_START_DATE + ICO_PERIOD;
const LOCKED_1Y_DATE = END_DATE + 365 * day;
const LOCKED_3M_DATE = END_DATE + 90 * day;
const LOCKED_1M_DATE = END_DATE + 30 * day;

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
    ICO_PERIOD,
    ICO_START_DATE,
    END_DATE,
    LOCKED_1Y_DATE,
    LOCKED_3M_DATE,
    LOCKED_1M_DATE,
    gas_amt
}