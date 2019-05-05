import test from 'ava';
import {mjdToDate} from './mjdToDate';
import {MJDEpochDate} from './constants';

interface ITest {
    input: Parameters<typeof mjdToDate>,
    expected: ReturnType<typeof mjdToDate>,
}

([
    {input: [0], expected: new Date(MJDEpochDate)},
    {input: [58608.5], expected: new Date('2019-05-05T12:00:00Z')},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`mjdToDate(${input}) → ${expected.toISOString()}`, (t) => {
        const actual = mjdToDate(...input);
        t.is(actual.getTime(), expected.getTime());
    });
});
