import test from 'ava';
import {ensureArray} from './ensureArray';

interface ITest {
    input: number | Array<number>,
    expected: ReturnType<typeof ensureArray>,
}

([
    {input: [0, 0, 0], expected: [0, 0, 0]},
    {input: 1, expected: [1]},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`ensureArray(${JSON.stringify(input)}) → ${expected}`, (t) => {
        const actual = ensureArray(input);
        t.deepEqual(actual, expected);
    });
});
