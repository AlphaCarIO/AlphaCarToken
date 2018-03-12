pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
//import "zeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";

/**
 * @title ACTCrowdsale
 */
contract ACTCrowdsale is Crowdsale, Ownable {
  using SafeMath for uint256;

  uint256 public openingTime;
  uint256 public closingTime;

  function getNow() public view returns (uint) {
    return now;
  }

  modifier onlyWhileOpen {
    uint _now = getNow();
    require(_now >= openingTime && _now <= closingTime);
    _;
  }

  uint256 public cap;

  address public tokenWallet;

  /**
   * @dev Constructor, takes maximum amount of wei accepted in the crowdsale.
   * @param _cap Max amount of wei to be contributed
   */
  function ACTCrowdsale(uint256 _rate, address _wallet, ERC20 _token, address _tokenWallet, uint256 _cap, uint256 _openingTime, uint256 _closingTime) 
    Crowdsale(_rate, _wallet, _token) public
  {
    require(_cap > 0);
    require(_openingTime >= now);
    require(_closingTime >= _openingTime);

    cap = _cap;
    tokenWallet = _tokenWallet;

    openingTime = _openingTime;
    closingTime = _closingTime;
  }

  function hasClosed() public view returns (bool) {
    return now > closingTime;
  }

  function capReached() public view returns (bool) {
    return weiRaised >= cap;
  }

  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal onlyWhileOpen {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    require(weiRaised.add(_weiAmount) <= cap);
  }

  function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal {
    token.transferFrom(tokenWallet, _beneficiary, _tokenAmount);
  }

}
