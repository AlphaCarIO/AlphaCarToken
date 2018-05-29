pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import "zeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";

/**
 * @title ACTCrowdsale
 */
contract ACARCrowdsale is Crowdsale, AllowanceCrowdsale, CappedCrowdsale, TimedCrowdsale, Destructible {
  using SafeMath for uint256;

  event log(address indexed sender, string log);


  function getNow() public view returns (uint) {
    return now;
  }

  modifier onlyWhileOpen2 {
    uint _now = getNow();
    
    require(_now >= openingTime && _now <= closingTime);
    _;
  }

  /**
   * @dev Constructor, takes maximum amount of wei accepted in the crowdsale.
   * @param _cap Max amount of wei to be contributed
   */
  function ACARCrowdsale(uint256 _rate, address _wallet, ERC20 _token, address _tokenWallet, uint256 _cap, uint256 _openingTime, uint256 _closingTime) 
    Crowdsale(_rate, _wallet, _token)
    AllowanceCrowdsale(_tokenWallet)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_openingTime, _closingTime) public
  {
  }

  function hasClosed() public view returns (bool) {
    return getNow() > closingTime;
  }

//
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal onlyWhileOpen2 {
    require(weiRaised.add(_weiAmount) <= cap);
    Crowdsale._preValidatePurchase(_beneficiary, _weiAmount);
  }

  function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal {
    token.transferFrom(tokenWallet, _beneficiary, _tokenAmount);
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
