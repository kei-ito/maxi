import * as path from 'path';
import {promises as afs} from 'fs';
import test from 'ava';
import {mktempdir} from './mktempdir';

test('create a temporary directory', async (t) => {
    const directory = await mktempdir();
    t.true((await afs.stat(directory)).isDirectory());
});

test('create a temporary directory with prefix', async (t) => {
    const prefix = 'foo';
    const directory = await mktempdir(prefix);
    t.true((await afs.stat(directory)).isDirectory());
    t.true(path.basename(directory).startsWith(`${prefix}-`));
});
