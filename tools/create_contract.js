var fs=require('fs');
var Web3 = require('web3');

var arguments = process.argv.splice(2);

config_file =__dirname + '/create.json'

output_file =__dirname + '/output.txt'

if (arguments.length > 0) {
    config_file = arguments[0];
}

console.log(config_file);

var config = JSON.parse(fs.readFileSync(config_file, 'utf-8'));

var web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(config.provider_url));
//
var abi_data = JSON.parse(fs.readFileSync(config.abi_file,'utf-8'));
//console.log(abi_data);

var bytecode_data = "0x" + fs.readFileSync(config.bytecode_file,'utf-8');

var Token = web3.eth.contract(abi_data);

// "ACAR","0xbe3b10d99239e507c6d18184b49c9b11fa2c358a"
byteCodeWithParam = Token.new.getData(config.symbol, config.wallet_addr, {data: bytecode_data});
//console.log("byteCodeWithParam:" + byteCodeWithParam);

fs.writeFileSync(output_file, byteCodeWithParam, 'utf-8')

/*
var contract_creation = {
    "from" : config.owner_addr,
    "gas" : config.gas,
    "gasPrice": config.gasPrice,
    "data" : byteCodeWithParam
};

var tx = web3.eth.sendTransaction(contract_creation);

console.log("tx:" + tx);
*/
