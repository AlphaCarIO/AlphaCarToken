pragma solidity ^0.4.18;

import '../token/MyCrowdsale.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract CrowdsaleMock is MyCrowdsale {

  uint public fakeNow = 0;

  function getNow() public view returns (uint) {
    if (fakeNow == 0) {
      return now;
    }
    return fakeNow;
  }
  
  function setNow(uint _now) public onlyOwner {
    fakeNow = _now;
  }

  function CrowdsaleMock(address _wallet, address tokenAddr) MyCrowdsale(_wallet, tokenAddr) public {
  }
  
}
