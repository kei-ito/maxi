import test from 'ava';
import * as http from 'http';
import {listen} from './listen';

test('listen a port', async (t) => {
    const server = await listen(http.createServer((req, res) => {
        res.writeHead(200);
        res.write(`${req.url}\n`);
        req.pipe(res);
    }));
    t.is(typeof server.address(), 'object');
    server.close();
});
