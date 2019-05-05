import test from 'ava';
import {nearest} from './nearest';

interface ITest {
    input: Parameters<typeof nearest>,
    expected: ReturnType<typeof nearest>,
}

([
    {input: [[0, 0, 0], 0], expected: 0},
    {input: [[0, 1, 2], 0], expected: 0},
    {input: [[0, 1, 2], -1], expected: 0},
    {input: [[0, 1, 2], 0.4], expected: 0},
    {input: [[0, 1, 2], 0.6], expected: 1},
    {input: [[0, 1, 2], 1.4], expected: 1},
    {input: [[0, 1, 2], 1.6], expected: 2},
    {input: [[0, 1, 2], 3], expected: 2},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`nearest(${input.join(', ')}) → ${expected}`, (t) => {
        const actual = nearest(...input);
        t.is(actual, expected);
    });
});
