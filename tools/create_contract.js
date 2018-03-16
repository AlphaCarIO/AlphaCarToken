var fs=require('fs');
var Web3 = require('web3');

var arguments = process.argv.splice(2);

config_file =__dirname + '/create.json'

out_dir = __dirname + '/out'

if (arguments.length > 0) {
    config_file = arguments[0];
}

console.log(config_file);

config = JSON.parse(fs.readFileSync(config_file, 'utf-8'));

if (config.out_dir != '') {
    out_dir = config.out_dir
}

output_file_abi = out_dir + '/' + config.file_name + '.abi'

output_file_bin = out_dir + '/' + config.file_name + '.bin'

web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(config.provider_url));
//
abi_txt = fs.readFileSync(config.abi_file, 'utf-8');
abi_data = JSON.parse(abi_txt);

bytecode_data = "0x" + fs.readFileSync(config.bytecode_file, 'utf-8');

contract = web3.eth.contract(abi_data);

if (config.type == "token") { //token
    byteCodeWithParam = bytecode_data
} else if (config.type == "crowdsale") { //crowdsale

    console.log('crowdsale cap', config.cap);

    byteCodeWithParam = contract.new.getData(config.rate, config.wallet, config.token_contract_addr,
        config.token_wallet_addr, config.cap, config.open_time, config.close_time, {data: bytecode_data})
        
} else {
    console.log("error type!")
    process.exit()
}

fs.writeFileSync(output_file_abi, abi_txt, 'utf-8')
fs.writeFileSync(output_file_bin, byteCodeWithParam, 'utf-8')

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
