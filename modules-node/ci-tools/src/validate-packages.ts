#!/usr/bin/env node
import * as util from 'util';
import program from 'commander';
import {validatePackages} from './validatePackages.js';
import {packageJSON} from './constants.js';

program
.version(packageJSON.version)
.option('--project', 'Path to Lerna project')
.action(async (program) => {
    await validatePackages(program.project || process.cwd())
    .catch((error) => {
        process.stderr.write(`${util.inspect(error)}\n`);
        process.exit(1);
    });
})
.parse(process.argv);
