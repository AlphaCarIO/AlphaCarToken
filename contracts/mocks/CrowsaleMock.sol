pragma solidity ^0.4.18;

import '../act/Crowsale.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract CrowsaleMock is Crowsale {

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

  function CrowsaleMock(address _wallet, address tokenAddr) Crowsale(_wallet, tokenAddr) public {
  }
  
}
