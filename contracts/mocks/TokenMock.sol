pragma solidity ^0.4.18;

import './../token/AlphaCarToken.sol';

// @dev TokenMock mocks current time

contract TokenMock is AlphaCarToken {

  uint public act_now = 0;

  function TokenMock(string symbol, string name, address wallet) AlphaCarToken(symbol, name, wallet) public {
  }

  //this function will never be used in production env.
  function setNow(uint _now) public onlyOwner {
    act_now = _now;
  }

  function getNow() public view returns (uint) {
    if (act_now == 0) {
      return now;
    }
    return act_now;
  }

}
