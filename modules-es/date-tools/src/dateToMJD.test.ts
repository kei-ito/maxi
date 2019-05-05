import test from 'ava';
import {dateToMJD} from './dateToMJD';
import {MJDEpochDate} from './constants';

interface ITest {
    input: Parameters<typeof dateToMJD>,
    expected: ReturnType<typeof dateToMJD>,
}

([
    {input: [new Date(MJDEpochDate)], expected: 0},
    {input: [new Date('2019-05-05T00:00:00Z')], expected: 58608},
    {input: [new Date('2019-05-05T12:00:00Z')], expected: 58608.5},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`dateToMJD(${input.join(', ')}) → ${expected}`, (t) => {
        const actual = dateToMJD(...input);
        t.is(actual, expected);
    });
});
