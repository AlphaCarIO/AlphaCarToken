pragma solidity ^0.4.21;

import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';
import 'zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
// ----- www.alphacar.io -----
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract AlphaCarToken is PausableToken, BurnableToken {
  
  string public symbol = "ACAR";

  string public name = "AlphaCar Token";
  
  uint8 public decimals = 18;

  uint public constant INITIAL_SUPPLY = 100 * 10 ** 8 * 10 ** 18;

  function AlphaCarToken() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }

  function () payable public {
    revert();
  }

}
