import test from 'ava';
import {getMatchedStrings} from './getMatchedStrings';

interface ITest {
    regexp: RegExp,
    tests: Array<{
        input: string,
        expected: Array<string>,
    }>,
}

([
    {
        regexp: /a/,
        tests: [
            {input: '', expected: []},
        ],
    },
    {
        regexp: /(a)/,
        tests: [
            {input: 'a', expected: ['a']},
            {input: 'aa', expected: ['a']},
        ],
    },
    {
        regexp: /(a)/gi,
        tests: [
            {input: 'aa', expected: ['a', 'a']},
            {input: 'Aa', expected: ['A', 'a']},
        ],
    },
] as Array<ITest>).forEach(({regexp, tests}, index1) => {
    tests.forEach(({input, expected}, index2) => {
        test(`#${index1}.${index2} getMatchedStrings(${input}, ${regexp}) → ${JSON.stringify(expected)}`, (t) => {
            const actual = getMatchedStrings(input, regexp);
            t.deepEqual(actual, expected);
        });
    });
});
