pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract Crowsale is Ownable {

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
  uint public CONTRIBUTIONS_MIN = 0.1 ether;

  uint constant public OFFSET = 420;

  uint constant public MIN_CROWSALE_TIME = 3600;

  uint8 public constant DECIMALS = 18;
    
  uint public constant DECIMALSFACTOR = 10 ** uint(DECIMALS);

  uint public constant TOKENS_CAP_ICO = 25 * 10 ** 8 * DECIMALSFACTOR;
  
  string public symbol;

  StandardToken public token;

  mapping(address => uint256) public weiBalances;

  uint public period = 30 days;
  uint public startDate = 1517443200;
  uint public endDate = startDate + period;

  event TokenPurchase(address indexed wallet, address indexed beneficiary, uint256 value, uint256 amount);

  event WalletUpdated(address newWallet);

  function balanceOfWei(address _owner) public view returns (uint256 balance) {
    return weiBalances[_owner];
  }

  function setStartDate(uint _startDate) public onlyOwner {
    require(startDate > now);
    require(_startDate > now);
    require(_startDate <= endDate.sub(MIN_CROWSALE_TIME));
    startDate = _startDate;
  }

  function setEndDate(uint _endDate) public onlyOwner {
    require(endDate > now);
    require(_endDate > now);
    require(_endDate >= startDate.add(MIN_CROWSALE_TIME));
    endDate = _endDate;
  }

  address public wallet;

  uint public crowsaleShare = 0;

  modifier validAddress(address addr) {
    require(addr != address(0x0));
    _;
  }

  mapping(address => bool) userAddr;

  function whitelist(address user) onlyOwner public {
    userAddr[user] = true;
  }

  function unWhitelist(address user) onlyOwner public {
    userAddr[user] = false;
  }

  function isInWhitelist(address user) public view
    returns (bool)
  {
    return userAddr[user];
  }

  function Crowsale(address _wallet, address tokenAddr) validAddress(_wallet) public {
    wallet = _wallet;
    token = StandardToken(tokenAddr);
  }

  // @return true if crowdsale event has ended
  function hasEnded() public view returns (bool) {
    return now > endDate;
  }

  // ------------------------------------------------------------------------
  // Accept ethers to buy tokens during the crowdsale(ICO)
  // ------------------------------------------------------------------------
  function () public payable {
    buyTokens(msg.sender);
  }

  // ------------------------------------------------------------------------
  // Accept ethers from one account for tokens to be created for another
  // account. Can be used by exchanges to purchase tokens on behalf of
  // it's user
  // ------------------------------------------------------------------------
  function buyTokens(address participant) public payable {
    
    require(participant != address(0x0));
    
    require(participant != wallet);

    require(now >= startDate && now <= endDate);

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

  function changeWallet(address _wallet) onlyOwner public {
    
    require(_wallet != address(0x0));
    require(_wallet != wallet);
    
    wallet = _wallet;
    WalletUpdated(wallet);

  }

}
