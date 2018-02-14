pragma solidity ^0.4.18;

import '../act/AlphaCarToken.sol';

// @dev TokenMock mocks current time

contract TokenMock is AlphaCarToken {

  function TokenMock(string symbol, address wallet) AlphaCarToken(symbol, wallet) public {
  }

  //this function will be removed in production env.
  function setNow(uint _now) public onlyOwner {
    fakeNow = _now;
  }

  function getNowFromOwner() public view onlyOwner returns (uint time) {
    return getNow();
  }
  
  /*
  function isContractFromOwner(address addr) public view onlyOwner
    returns (bool)
  {
    return isContract(addr);
  }
  
  function isContract(address addr)
        internal
        constant
        returns (bool)
  {
    uint256 size;
    assembly { size := extcodesize(addr) }
    return size > 0;
  }
  */

}