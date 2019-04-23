#!/bin/bash

docker --version
if [[ $? -ne 0 ]]; then
    curl https://download.docker.com/mac/stable/Docker.dmg > ~/Downloads/Docker.dmg
    open ~/Downloads/Docker.dmg
    exit 1
fi

node --version
if [[ $? -ne 0 ]]; then
    brew install node
    if [[ $? -ne 0 ]]; then exit 1; fi
fi

sam --version
if [[ $? -ne 0 ]]; then
    brew tap aws/tap
    brew install aws-sam-cli
    sam --version
    if [[ $? -ne 0 ]]; then exit 1; fi
fi
