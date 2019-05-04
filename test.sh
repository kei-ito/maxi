#!/bin/bash
set -eux
npx lerna run cleanup --parallel --scope @maxi-js/$1
npx lerna run build --parallel --scope @maxi-js/$1
npx lerna run test  --parallel --scope @maxi-js/$1
