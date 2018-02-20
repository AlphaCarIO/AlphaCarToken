pragma solidity ^0.4.18;

import '../act/AlphaCarToken.sol';

// @dev TokenMock mocks current time

contract TokenMock is AlphaCarToken {

  function TokenMock(string symbol, address wallet) AlphaCarToken(symbol, wallet) public {
  }

  //this function will never be used in production env.
  function setNow(uint _now) public onlyOwner {
    fakeNow = _now;
  }

  function getNowFromOwner() public view returns (uint time) {
    return getNow();
  }

}