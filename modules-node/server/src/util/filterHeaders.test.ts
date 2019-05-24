import test from 'ava';
import {IHeader} from './types';
import {filterHeaders, IFilteredHeaders} from './filterHeaders';

interface ITest {
    input: IHeader,
    expected: IFilteredHeaders,
}

([
    {
        input: {},
        expected: {},
    },
    {
        input: {
            foo: null,
        },
        expected: {},
    },
    {
        input: {
            foo: undefined,
        },
        expected: {},
    },
    {
        input: {
            foo: 1,
        },
        expected: {
            headers: {
                foo: 1,
            },
        },
    },
    {
        input: {
            foo: '1',
        },
        expected: {
            headers: {
                foo: '1',
            },
        },
    },
    {
        input: {
            foo: ['1'],
        },
        expected: {
            headers: {
                foo: '1',
            },
        },
    },
    {
        input: {
            foo: ['1', 0, undefined, null],
        },
        expected: {
            multiValueHeaders: {
                foo: ['1', 0],
            },
        },
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} filterHeaders(${JSON.stringify(input)}) → ${JSON.stringify(expected)}`, (t) => {
        t.deepEqual(filterHeaders(input), expected);
    });
});
