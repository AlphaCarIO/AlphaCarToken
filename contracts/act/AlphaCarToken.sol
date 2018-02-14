pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol';

// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract AlphaCarToken is PausableToken {

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
  uint private CONTRIBUTIONS_MIN = 1 ether;

  uint constant public OFFSET = 420;

  uint constant public MIN_CROWSALE_TIME = 3600;

  uint8 public constant DECIMALS = 8;
    
  uint public constant DECIMALSFACTOR = 10 ** uint(DECIMALS);

  uint public constant TOKENS_TOTAL = 100 * 10 ** 8 * DECIMALSFACTOR;

  uint public constant TOKENS_CAP_ICO = 25 * 10 ** 8 * DECIMALSFACTOR;

  string public name = "Alpha Car Token";
  
  uint8 public decimals = DECIMALS;

  uint public divider = 10 ** uint(18 - decimals);
  
  string public symbol;

  string public version = "v1.0";

    // ------------------------------------------------------------------------
    // Tranche 1 token sale start date and end date
    // Do not use the `now` function here
    // ICO start - Feb 1st 2018 @ 8:00 a.m.
    // ICO end - 30 days later after ICO started.
    // ------------------------------------------------------------------------
  uint public period = 30 days;
  uint public startDate = 1517443200;
  uint public endDate = startDate + period;

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

  uint public fakeNow = 0;

  uint public crowsaleShare = 0;

  function getNow() internal view returns (uint) {
    if (fakeNow == 0) {
      return now;
    }
    return fakeNow;
  }

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

  function AlphaCarToken(string _symbol, address _wallet) validAddress(_wallet) public {
    symbol = _symbol;
    totalSupply_ = TOKENS_TOTAL;
    wallet = _wallet;
    balances[wallet] = totalSupply_;
  }

  // ------------------------------------------------------------------------
  // Accept ethers to buy tokens during the crowdsale(ICO)
  // ------------------------------------------------------------------------
  function () public payable {
    proxyPayment(msg.sender);
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
  function proxyPayment(address participant) public payable {
    
    require(participant != address(0x0));
    
    require(participant != wallet);

    uint nowTime = getNow();
    require(nowTime >= startDate && nowTime <= endDate);

    require(isInWhitelist(participant));

    require(msg.value >= CONTRIBUTIONS_MIN);

    uint tokens = TOKEN_PER_ETHER.mul(msg.value).div(divider);
    crowsaleShare = crowsaleShare.add(tokens);

    require(crowsaleShare <= TOKENS_CAP_ICO);

    balances[participant] = balances[participant].add(tokens);
    balances[wallet] = balances[wallet].sub(tokens);

    wallet.transfer(msg.value);
    TokenPurchase(wallet, msg.sender, participant, msg.value, tokens);

  }

  event TokenPurchase(address indexed wallet, address indexed purchaser, address indexed beneficiary, 
    uint256 value, uint256 amount);

  function changeWallet(address _wallet) onlyOwner public {
    
    require(_wallet != address(0x0));
    
    require(_wallet != wallet);

      balances[_wallet] = balances[wallet];
      balances[wallet] = 0;
      wallet = _wallet;
      WalletUpdated(wallet);
  }

  event WalletUpdated(address newWallet);

  /* Approves and then calls the receiving contract 
  function approveAndCall(address _spender, uint256 _value, bytes _extraData) public
    whenNotPaused
    validAddress(_spender)
    returns (bool success)
  {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);

    //call the receiveApproval function on the contract you want to be notified. 
    //This crafts the function signature manually so one doesn't have to include a contract in here just for this.
    //receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
    //it is assumed that when does this that the call *should* succeed, otherwise one would use vanilla approve instead.
    require(_spender.call(bytes4(bytes32(keccak256("receiveApproval(address, uint256, address, bytes)"))), 
      msg.sender, _value, this, _extraData));

    return true;
  }
  */

}
