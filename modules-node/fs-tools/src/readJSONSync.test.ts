import {promises as afs} from 'fs';
import * as path from 'path';
import anyTest, {TestInterface} from 'ava';
import {mktempdir} from './mktempdir';
import {readJSONSync} from './readJSONSync';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('read a file as an object', async (t) => {
    const filePath = path.join(t.context.directory, 'foo.json');
    const expected = {foo: 'bar'};
    await afs.writeFile(filePath, JSON.stringify(expected));
    const actual = readJSONSync<typeof expected>(filePath);
    t.deepEqual(actual, expected);
});
