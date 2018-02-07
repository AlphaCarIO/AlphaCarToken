pragma solidity ^0.4.18;

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - configuration parameters
// ----------------------------------------------------------------------------
contract TokenConfig {

    string public constant NAME = "Alpha Car Token";
    
    uint8 public constant DECIMALS = 8;
    
    string public constant VERSION = "V1.0";
    
    uint public constant DECIMALSFACTOR = 10 ** uint(DECIMALS);

    uint public constant TOKENS_TOTAL = 100 * 10 ** 8 * DECIMALSFACTOR;

    uint public constant TOKENS_CAP_ICO = 25 * 10 ** 8 * DECIMALSFACTOR;
    uint public constant TOKENS_CAP_MGR = 26 * 10 ** 8 * DECIMALSFACTOR;
    uint public constant TOKENS_CAP_CONSULTANT = 5 * 10 ** 8 * DECIMALSFACTOR;
    
    uint public constant TOKENS_CAP_MINING = 20 * 10 ** 8 * DECIMALSFACTOR;
    uint public constant TOKENS_CAP_FUND = 16 * 10 ** 8 * DECIMALSFACTOR;
    uint public constant TOKENS_CAP_ECOLOGY = 8 * 10 ** 8 * DECIMALSFACTOR;

  // token number for 1 ether
    uint public constant TOKEN_BONUS_PER_ETHER_P1 = 30000;

    uint public constant TOKEN_BONUS_PER_ETHER_P2 = 18000;
    
    uint public constant TOKEN_PER_ETHER = 60000;
    
    // ------------------------------------------------------------------------
    // Individual transaction contribution min and max amounts
    // Set to 0 to switch off, or `x ether`
    // ------------------------------------------------------------------------
    uint public CONTRIBUTIONS_MIN = 1 ether;
    uint public CONTRIBUTIONS_MAX = 10000 ether;

    uint constant public OFFSET = 420;
    uint constant public MIN_CROWSALE_TIME = 3600;

}
