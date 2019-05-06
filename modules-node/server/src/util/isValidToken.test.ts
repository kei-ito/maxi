import test from 'ava';
import {isValidToken} from './isValidToken';

interface ITest {
    input: Parameters<typeof isValidToken>,
    expected: ReturnType<typeof isValidToken>,
}

([
    {input: [null], expected: false},
    {input: [undefined], expected: false},
    {input: [0], expected: true},
    {input: [1], expected: true},
    {input: [''], expected: true},
    {input: ['1'], expected: true},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} isValidToken(${JSON.stringify(input).slice(1, -1)}) → ${JSON.stringify(expected)}`, (t) => {
        t.deepEqual(isValidToken(...input), expected);
    });
});
