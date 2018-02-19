pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract AlphaCarToken is PausableToken {
  
  string public symbol = "ACAR";

  string public name = "Alpha Car Token";
  
  uint8 public decimals = 18;
    
  uint public constant DECIMALSFACTOR = 10 ** 18;

  uint public constant INITIAL_SUPPLY = 100 * 10 ** 8 * DECIMALSFACTOR;

  function AlphaCarToken() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }

}
