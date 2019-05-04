#!/bin/bash
rm -rf layer/nodejs/node_modules
rsync --copy-links -amv \
    --exclude 'node_modules/@maxi-js/data-viewer/node_modules' \
    --exclude '@types' \
    --exclude '.*' \
    --exclude 'src' \
    --exclude '*.test.*' \
    --include '*/' \
    --include '*.js' \
    --include 'package.json' \
    --include '*.html' \
    --exclude '*' \
    node_modules layer/nodejs/
