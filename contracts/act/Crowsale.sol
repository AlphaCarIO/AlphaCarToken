pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

interface Token {
  function transfer(address to, uint256 value) public returns (bool);
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
}

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

  Token public token;

  mapping(address => uint256) public weiBalances;

  uint public period = 30 days;
  uint public startDate = 1517443200;
  uint public endDate = startDate + period;

  event TokenPurchase(address indexed wallet, address indexed buyer, address indexed beneficiary, uint256 value, uint256 amount);

  event WalletUpdated(address newWallet);

  function balanceOfWei(address _owner) public view returns (uint256 balance) {
    return weiBalances[_owner];
  }

  uint public fakeNow = 0;

  function getNow() public view returns (uint) {
    if (fakeNow == 0) {
      return now;
    }
    return fakeNow;
  }

  // @return true if crowdsale event has ended
  function hasEnded() public view returns (bool) {
    return getNow() > endDate;
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

  address public wallet;

  uint public crowsaleShare = 0;

  modifier validAddress(address addr) {
    require(addr != address(0x0));
    _;
  }

  function Crowsale(address _wallet, address tokenAddr) validAddress(_wallet) public {
    wallet = _wallet;
    token = Token(tokenAddr);
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

    uint nowTime = getNow();
    require(nowTime >= startDate && nowTime <= endDate);

    uint weiRaised = msg.value;

    require(weiRaised >= CONTRIBUTIONS_MIN);

    uint tokens = TOKEN_PER_ETHER.mul(weiRaised);
    crowsaleShare = crowsaleShare.add(tokens);

    require(crowsaleShare <= TOKENS_CAP_ICO);
    
    weiBalances[participant] = weiBalances[participant].add(weiRaised);

    token.transferFrom(owner, participant, tokens);

    wallet.transfer(msg.value);

    TokenPurchase(wallet, msg.sender, participant, msg.value, tokens);

  }

  function changeWallet(address _wallet) onlyOwner public {
    
    require(_wallet != address(0x0));
    require(_wallet != wallet);
    
    wallet = _wallet;
    WalletUpdated(wallet);

  }

}
