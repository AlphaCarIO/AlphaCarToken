var fs=require('fs');
var Web3 = require('web3');

var arguments = process.argv.splice(2);

config_file =__dirname + '/create.json'

output_file =__dirname + '/out/byteCodeWithParam.txt'

if (arguments.length > 0) {
    config_file = arguments[0];
}

console.log(config_file);

config = JSON.parse(fs.readFileSync(config_file, 'utf-8'));

output_file_abi =__dirname + '/out/' + config.file_name;

web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(config.provider_url));
//
abi_txt = fs.readFileSync(config.abi_file, 'utf-8');
abi_data = JSON.parse(abi_txt);
//console.log(abi_data);

bytecode_data = "0x" + fs.readFileSync(config.bytecode_file,'utf-8');

Token = web3.eth.contract(abi_data);

// "ACAR","0xbe3b10d99239e507c6d18184b49c9b11fa2c358a"
byteCodeWithParam = Token.new.getData(config.symbol, config.name, config.wallet_addr, {data: bytecode_data})
//console.log("byteCodeWithParam:" + byteCodeWithParam);

fs.writeFileSync(output_file_abi, abi_txt, 'utf-8')
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
