import test from 'ava';
import {PassThrough} from 'stream';
import {asBuffer} from './streamReader';

test('read as buffer', async (t) => {
    const stream = new PassThrough();
    const promise = asBuffer(stream);
    const data = ['a', 'b', 'c', 'd'];
    for (const fragment of data) {
        stream.push(Buffer.from(fragment));
    }
    stream.end();
    const actual = await promise;
    t.true(actual.equals(Buffer.from(data.join(''))));
});
