#!/bin/bash /usr/bin/python
#---coding=utf-8---

import json
import sys

js_template='''
abi = %s;
rawByteCode = "%s";
AlphaCarToken = web3.eth.contract(abi);
byteCodeWithParam = AlphaCarToken.new.getData('ACAR', '0x%s', {data: rawByteCode});
console.log(byteCodeWithParam)

'''

js_template_mock='''
abi = %s;
rawByteCode = "%s";
TokenMock = web3.eth.contract(abi);
byteCodeWithParam = TokenMock.new.getData('ACAR', '0x%s', {data: rawByteCode});
console.log(byteCodeWithParam)

'''

acc = "0xbca685cb5dfd40658eabe435c56559915aa1b815"

if len(sys.argv) > 1:
    acc = sys.argv[1]

acc = acc.lower()

if (acc.startswith("0x")) :
    acc = acc[2:]

with open("../build/contracts/AlphaCarToken.json","r") as f:
    raw_data = json.load(f)
    abi = json.dumps(raw_data['abi'])
    bytecode = raw_data['bytecode']
    with open("./param.txt","w") as f2:
        f2.write(acc)
    with open("./abi.json","w") as f2:
        f2.write(abi)
    with open("./bytecode.txt","w") as f2:
        f2.write(bytecode)
    with open("./preload_aaatoken.js","w") as f2:
        f2.write(js_template % (abi, bytecode, acc))

with open("../build/contracts/TokenMock.json","r") as f:
    raw_data = json.load(f)
    abi = json.dumps(raw_data['abi'])
    bytecode = raw_data['bytecode']
    with open("./abi_mock.json","w") as f2:
        f2.write(abi)
    with open("./bytecode_mock.txt","w") as f2:
        f2.write(bytecode)
    with open("./preload_aaatoken_mock.js","w") as f2:
        f2.write(js_template_mock % (abi, bytecode, acc))

#with open("../build/contracts/AAATokenDeployer.json","r") as f:
#    raw_data = json.load(f)
#    abi = json.dumps(raw_data['abi'])
#    with open("./deployer_abi.json","w") as f2:
#        f2.write(abi)
