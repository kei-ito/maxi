#!/usr/bin/env node
import * as util from 'util';
import program from 'commander';
import {validatePackages} from '@maxi-js/config-validator';
import {packageJSON} from './constants';

program
.version(packageJSON.dependencies['@maxi-js/config-validator'])
.option('--project', 'Path to Lerna project')
.action(async (program) => {
    await validatePackages(program.project || process.cwd())
    .catch((error) => {
        process.stderr.write(`${util.inspect(error)}\n`);
        process.exit(1);
    });
})
.parse(process.argv);
