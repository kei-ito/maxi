import test from 'ava';
import * as http from 'http';
import * as os from 'os';
import {request} from './request';
import {asString} from '@maxi-js/stream-tools';
import {listen} from './listen';

test('request as a string', async (t) => {
    const server = await listen(
        http.createServer((req, res) => {
            res.writeHead(200);
            res.write(`${req.url}\n`);
            req.pipe(res);
        }),
    );
    const address = server.address();
    if (address && typeof address === 'object') {
        const actual = await request(`http://${os.hostname()}:${address.port}/foo`, asString);
        server.close();
        t.is(actual.statusCode, 200);
        t.is(actual.body, '/foo\n');
    } else {
        t.is(address && typeof address, 'object');
    }
});
