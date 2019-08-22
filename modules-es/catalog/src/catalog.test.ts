import test from 'ava';
import * as http from 'http';
import {createdAt, source, map} from './catalog';

test('createdAt', (t) => {
    t.is(typeof createdAt, 'string');
});

test('source.title', (t) => {
    t.is(typeof source.title, 'string');
});

test('source.urls', (t) => {
    t.is(typeof source.urls.html, 'string');
});

map.forEach((object, objectId) => {
    test(`${object.name} (${objectId})`, async (t) => {
        t.is(typeof object.id, 'string');
        t.is(typeof object.name, 'string');
        t.is(typeof object.category, 'string');
        t.is(typeof object.ra, 'number');
        t.is(typeof object.dec, 'number');
        t.is(typeof object.l, 'number');
        t.is(typeof object.b, 'number');
        t.is(typeof object.source.title, 'string');
        t.is(typeof object.source.urls.data, 'string');
        t.is(typeof object.source.urls.html, 'string');
        t.is(typeof object.source.urls.image, 'string');
        const res = await new Promise<http.IncomingMessage>((resolve, reject) => {
            const req = http.request(object.source.urls.data, {
                method: 'HEAD',
            });
            req.once('response', resolve);
            req.once('error', reject);
            req.end();
        });
        t.is(res.statusCode, 200, `${res.statusCode} ${res.statusMessage}`);
    });
});
