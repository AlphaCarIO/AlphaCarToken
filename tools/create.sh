#!/bin/bash

if [ "xn" = x"$2" ]; then
    rm -rf out
    mkdir -p out
fi

node create_contract.js $1
