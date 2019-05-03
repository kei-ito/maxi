import test from 'ava';
import * as http from 'http';
import {request} from './request';
import {asString} from '@maxi-js/stream-tools';
import {listen} from './listen';
import {getHostFromAddressInfo} from './getHostFromAddressInfo';

test('request as a string', async (t) => {
    const server = await listen(http.createServer((req, res) => {
        res.writeHead(200);
        res.write(`${req.url}\n`);
        req.pipe(res);
    }));
    const host = getHostFromAddressInfo(server.address());
    const actual = await request(`http://${host}/foo`, asString);
    server.close();
    t.is(actual.statusCode, 200);
    t.is(actual.body, '/foo\n');
});
