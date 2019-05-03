#!/bin/bash
set -eux
npx lerna run cleanup --scope @maxi-js/$1
npx lerna run build --scope @maxi-js/$1
npx lerna run test --scope @maxi-js/$1
