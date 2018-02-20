const BigNumber = require('bignumber.js');

const symbol = "ACAR";
const tokenpether = 60000;

const tokenpether_p1 = 90000;
const tokenpether_p2 = 78000;

const DECIMALS = 18;
const ONE = 10 ** DECIMALS;
const total = BigNumber(100 * 10 ** 8 * ONE);
const amt = BigNumber(100000 * ONE);
const amt1 = BigNumber(10000 * ONE);

const day = 86400;
const PRE_ICO_PERIOD_P1 = 10 * day;
const ICO_PERIOD = 30 * day;

const PREICO_START_DATE_P1 = 1515974400;
const PREICO_START_DATE_P2 = PREICO_START_DATE_P1 + PRE_ICO_PERIOD_P1;
const ICO_START_DATE = 1517443200;
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
    tokenpether_p1,
    tokenpether_p2,
    total,
    amt,
    amt1,
    day,
    PRE_ICO_PERIOD_P1,
    ICO_PERIOD,
    PREICO_START_DATE_P1,
    PREICO_START_DATE_P2,
    ICO_START_DATE,
    END_DATE,
    LOCKED_1Y_DATE,
    LOCKED_3M_DATE,
    LOCKED_1M_DATE,
    gas_amt
}