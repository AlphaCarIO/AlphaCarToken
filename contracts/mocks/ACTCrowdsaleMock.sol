pragma solidity ^0.4.18;

import '../crowdsale/ACTCrowdsale.sol';

contract ACTCrowdsaleMock is ACTCrowdsale {

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

  function ACTCrowdsaleMock(uint256 _rate, address _wallet, ERC20 _token, address _tokenWallet, uint256 _cap, uint256 _openingTime, uint256 _closingTime)
    ACTCrowdsale(_rate, _wallet, _token, _tokenWallet, _cap, _openingTime, _closingTime) public 
  {
  }
  
}
