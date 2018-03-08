#!/bin/bash

rm -rf out

mkdir -p out

node create_contract.js $1
