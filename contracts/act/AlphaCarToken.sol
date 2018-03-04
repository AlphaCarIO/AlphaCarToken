pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';
import 'zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol';
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------
interface tokenRecipient {
  function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public; 
}

contract AlphaCarToken is PausableToken, BurnableToken {

  using SafeERC20 for ERC20;
  using SafeMath for uint;

  /*
  NOTE:
  The following variables are OPTIONAL vanities. One does not have to include them.
  They allow one to customise the token contract & in no way influences the core functionality.
  Some wallets/interfaces might not even bother to look at this information.
  */

  // token number for 1 ether
  uint public constant TOKEN_PER_ETHER = 60000;
    
    // ------------------------------------------------------------------------
    // Individual transaction contribution min and max amounts
    // Set to 0 to switch off, or `x ether`
    // ------------------------------------------------------------------------
  uint private CONTRIBUTIONS_MIN = 0.1 ether;

  uint constant public MIN_CROWSALE_TIME = 600;

  uint8 public constant DECIMALS = 18;
    
  uint public constant DECIMALSFACTOR = 10 ** uint(DECIMALS);

  uint public constant TOKENS_TOTAL = 100 * 10 ** 8 * DECIMALSFACTOR;

  uint public constant TOKENS_CAP_ICO = 25 * 10 ** 8 * DECIMALSFACTOR;

  string public name = "Alpha Car Token";
  
  uint8 public decimals = DECIMALS;

  uint public divider = 10 ** uint(18 - decimals);
  
  string public symbol;

  mapping(address => uint256) public weiBalances;

    // ------------------------------------------------------------------------
    // Tranche 1 token sale start date and end date
    // Do not use the `now` function here
    // ICO start - Mar 25th 2018 @ 8:00:00
    // ICO end - Mar 31th 2018 @ 23:59:59
    // ------------------------------------------------------------------------
  uint public startDate = 1521936000;
  uint public endDate = 1522511999;

  function setStartDate(uint _startDate) public onlyOwner {
    uint nowTime = getNow();
    require(startDate > nowTime);
    require(_startDate > nowTime);
    startDate = _startDate;
    uint tempEndDate = startDate.add(MIN_CROWSALE_TIME);
    if (endDate < tempEndDate) {
      endDate = tempEndDate;
    }
  }

  function setEndDate(uint _endDate) public onlyOwner {
    uint nowTime = getNow();
    require(endDate > nowTime);
    require(_endDate > nowTime);
    endDate = _endDate;
  }

  address public wallet;

  uint public act_now = 0;

  uint public crowsaleShare = 0;

  function getNow() public view returns (uint) {
    if (act_now == 0) {
      return now;
    }
    return act_now;
  }

  modifier validAddress(address addr) {
    require(addr != address(0x0));
    _;
  }

  function AlphaCarToken(string _symbol, address _wallet) validAddress(_wallet) public {
    symbol = _symbol;
    totalSupply_ = TOKENS_TOTAL;
    wallet = _wallet;
    balances[wallet] = totalSupply_;
  }

  // ------------------------------------------------------------------------
  // Accept ethers to buy tokens during the crowdsale(ICO)
  // ------------------------------------------------------------------------
  function () external payable {
    buyTokens(msg.sender);
  }

  // @return true if crowdsale event has ended
  function hasEnded() public view returns (bool) {
    return getNow() > endDate;
  }

  function getRemainingCrowsaleShare() public view returns (uint) {
    return TOKENS_CAP_ICO - crowsaleShare;
  }

  // ------------------------------------------------------------------------
  // Accept ethers from one account for tokens to be created for another
  // account. Can be used by exchanges to purchase tokens on behalf of
  // it's user
  // ------------------------------------------------------------------------
  function buyTokens(address participant) public payable {
    
    require(participant != address(0x0));

    uint nowTime = getNow();
    require(nowTime >= startDate && nowTime <= endDate);

    uint weiRaised = msg.value;

    require(weiRaised >= CONTRIBUTIONS_MIN);

    uint tokens = TOKEN_PER_ETHER.mul(weiRaised);
    crowsaleShare = crowsaleShare.add(tokens);

    require(crowsaleShare <= TOKENS_CAP_ICO);
    
    weiBalances[participant] = weiBalances[participant].add(weiRaised);

    balances[participant] = balances[participant].add(tokens);
    balances[wallet] = balances[wallet].sub(tokens);

    wallet.transfer(weiRaised);
    TokenPurchase(wallet, msg.sender, participant, weiRaised, tokens);

  }

  function changeWallet(address _wallet) onlyOwner public {
    
    require(_wallet != address(0x0));
    
    require(_wallet != wallet);

      balances[_wallet] = balances[wallet];
      balances[wallet] = 0;
      wallet = _wallet;

      WalletUpdated(wallet);
  }
  
  function approveAndCall(address _spender, uint256 _value, bytes _extraData) public
    returns (bool success) 
  {
      tokenRecipient spender = tokenRecipient(_spender);
      if (approve(_spender, _value)) {
          spender.receiveApproval(msg.sender, _value, this, _extraData);            
          return true;
      }
      return false;
  }

  event TokenPurchase(address indexed wallet, address indexed purchaser, address indexed beneficiary, 
    uint256 value, uint256 amount);

  event WalletUpdated(address newWallet);

}
