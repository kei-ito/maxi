import test from 'ava';
import {clamp} from './clamp';

interface ITest {
    input: Parameters<typeof clamp>,
    expected: ReturnType<typeof clamp>,
}

([
    {input: [0, 0, 0], expected: 0},
    {input: [0, 1, 2], expected: 1},
    {input: [0, -2, -1], expected: -1},
    {input: [0, -2], expected: 0},
    {input: [0], expected: 0},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`clamp(${input.join(', ')}) → ${expected}`, (t) => {
        const actual = clamp(...input);
        t.is(actual, expected);
    });
});
