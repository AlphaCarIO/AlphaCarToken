pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
//import "zeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";

/**
 * @title ACTCrowdsale
 */
contract ACTCrowdsale is Crowdsale {
  using SafeMath for uint256;

  uint256 public cap;

  /**
   * @dev Constructor, takes maximum amount of wei accepted in the crowdsale.
   * @param _cap Max amount of wei to be contributed
   */
  function ACTCrowdsale(uint256 _rate, address _wallet, ERC20 _token, uint256 _cap) 
    Crowdsale(_rate, _wallet, _token) public
  {
    require(_cap > 0);
    cap = _cap;
  }

  /**
   * @dev Checks whether the cap has been reached. 
   * @return Whether the cap was reached
   */
  function capReached() public view returns (bool) {
    return weiRaised >= cap;
  }

  /**
   * @dev Extend parent behavior requiring purchase to respect the funding cap.
   * @param _beneficiary Token purchaser
   * @param _weiAmount Amount of wei contributed
   */
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    require(weiRaised.add(_weiAmount) <= cap);
  }

}
