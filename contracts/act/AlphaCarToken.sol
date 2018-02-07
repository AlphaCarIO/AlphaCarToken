pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/PausableToken.sol';
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/token/SafeERC20.sol';
import './TokenConfig.sol';


// ----------------------------------------------------------------------------
// Alpha Car Token smart contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

contract AlphaCarToken is PausableToken, TokenConfig {

  using SafeERC20 for ERC20;
  using SafeMath for uint;

  /*
  NOTE:
  The following variables are OPTIONAL vanities. One does not have to include them.
  They allow one to customise the token contract & in no way influences the core functionality.
  Some wallets/interfaces might not even bother to look at this information.
  */

  string public name = NAME;
  
  uint8 public decimals = DECIMALS;

  uint public divider = 10 ** uint(18 - decimals);
  
  string public symbol;

  string public version = VERSION;
    

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

  modifier notWallet(address addr) {
    require(addr != wallet);
    _;
  }

  function AlphaCarToken(string _symbol, address _wallet) validAddress(_wallet) public {
    symbol = _symbol;
    totalSupply = TOKENS_TOTAL;
    wallet = _wallet;
    balances[wallet] = totalSupply;
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
  function proxyPayment(address participant) public payable 
    validAddress(participant)
    notWallet(participant)
  {

    require(msg.value >= CONTRIBUTIONS_MIN);

    uint nowTime = getNow();
    require(nowTime >= startDate && nowTime <= endDate);

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

  function changeWallet(address _wallet)
    onlyOwner
    validAddress(_wallet)
    notWallet(_wallet)
  {
      balances[_wallet] = balances[wallet];
      balances[wallet] = 0;
      wallet = _wallet;
      WalletUpdated(wallet);
  }

  event WalletUpdated(address newWallet);

  /* Approves and then calls the receiving contract */
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

}
