#!/bin/bash

if [ "xn" = x"$2" ]; then
    rm -rf out
fi

mkdir -p out

node create_contract.js $1
