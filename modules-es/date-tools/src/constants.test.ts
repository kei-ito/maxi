import test from 'ava';
import {MJDEpochDate, SECOND_MS, MINUTE_MS, HOUR_MS, DAY_MS} from './constants';

test('SECOND_MS', (t) => {
    t.is(SECOND_MS, 1000);
});

test('MINUTE_MS', (t) => {
    t.is(MINUTE_MS, SECOND_MS * 60);
});

test('HOUR_MS', (t) => {
    t.is(HOUR_MS, MINUTE_MS * 60);
});

test('DAY_MS', (t) => {
    t.is(DAY_MS, HOUR_MS * 24);
});

test('MJDEpochDate', (t) => {
    t.is(MJDEpochDate, new Date('1858-11-17T00:00:00Z').getTime());
});
