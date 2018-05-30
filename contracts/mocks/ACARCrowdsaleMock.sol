pragma solidity ^0.4.21;

import '../crowdsale/ACARCrowdsale.sol';

contract ACARCrowdsaleMock is ACARCrowdsale {

  event log(address indexed sender, string log, uint num);

  function ACARCrowdsaleMock(uint256 _rate, address _wallet, ERC20 _token, address _tokenWallet, uint256 _cap, uint256 _openingTime, uint256 _closingTime)
    ACARCrowdsale(_rate, _wallet, _token, _tokenWallet, _cap, _openingTime, _closingTime) public 
  {
  }

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

  modifier onlyWhileOpen {
    uint _now = getNow();

    emit log(msg.sender, "", _now);
    
    require(_now >= openingTime && _now <= closingTime);
    _;
  }

  function hasClosed() public view returns (bool) {
    return getNow() > closingTime;
  }

  function destroy() onlyOwner public {
    require(getNow() > closingTime);
    selfdestruct(owner);
  }

  function destroyAndSend(address _recipient) onlyOwner public {
    require(getNow() > closingTime);
    selfdestruct(_recipient);
  }
  
}
