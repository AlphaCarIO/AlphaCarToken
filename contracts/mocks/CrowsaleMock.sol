pragma solidity ^0.4.18;

import '../act/Crowsale.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract CrowsaleMock is Crowsale {

  uint public fakeNow = 0;

  function getNow() internal view returns (uint) {
    if (fakeNow == 0) {
      return now;
    }
    return fakeNow;
  }

  function setStartDate(uint _startDate) public onlyOwner {
    uint nowTime = getNow();
    require(startDate > nowTime);
    require(_startDate > nowTime);
    require(_startDate <= endDate.sub(MIN_CROWSALE_TIME));
    startDate = _startDate;
  }

  function setEndDate(uint _endDate) public onlyOwner {
    uint nowTime = getNow();
    require(endDate > nowTime);
    require(_endDate > nowTime);
    require(_endDate >= startDate.add(MIN_CROWSALE_TIME));
    endDate = _endDate;
  }

  function CrowsaleMock(address _wallet, address tokenAddr) Crowsale(_wallet, tokenAddr) public {
  }

  // @return true if crowdsale event has ended
  function hasEnded() public view returns (bool) {
    return getNow() > endDate;
  }

  // ------------------------------------------------------------------------
  // Accept ethers from one account for tokens to be created for another
  // account. Can be used by exchanges to purchase tokens on behalf of
  // it's user
  // ------------------------------------------------------------------------
  function buyTokens(address participant) public payable {
    
    require(participant != address(0x0));
    
    require(participant != wallet);

    uint nowTime = getNow();
    require(nowTime >= startDate && nowTime <= endDate);

    require(isInWhitelist(participant));

    uint weiRaised = msg.value;

    require(weiRaised >= CONTRIBUTIONS_MIN);

    uint tokens = TOKEN_PER_ETHER.mul(weiRaised);
    crowsaleShare = crowsaleShare.add(tokens);

    require(crowsaleShare <= TOKENS_CAP_ICO);
    
    weiBalances[participant] = weiRaised;
    token.transfer(participant, tokens);

    wallet.transfer(msg.value);

    TokenPurchase(wallet, participant, msg.value, tokens);

  }
}
