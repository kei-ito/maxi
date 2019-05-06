import test from 'ava';
import {normalizeTokens} from './normalizeTokens';

interface ITest {
    input: Parameters<typeof normalizeTokens>,
    expected: ReturnType<typeof normalizeTokens>,
}

([
    {
        input: [],
        expected: {},
    },
    {
        input: [{foo: undefined}],
        expected: {},
    },
    {
        input: [
            {foo: undefined, bar: 'bar'}
        ],
        expected: {bar: ['bar']},
    },
    {
        input: [
            {foo: undefined, bar: 'bar0', baz: 'baz'},
            {foo: [1, 2], bar: 'bar1', baz: null}
        ],
        expected: {foo: [1, 2], bar: ['bar1'], baz: ['baz']},
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} normalizeTokens(${JSON.stringify(input).slice(1, -1)}) → ${JSON.stringify(expected)}`, (t) => {
        t.deepEqual(normalizeTokens(...input), expected);
    });
});
