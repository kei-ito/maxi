import test from 'ava';
import {APIGatewayProxyResult} from 'aws-lambda';
import {IHeader} from './types';
import {filterHeaders} from './filterHeaders';

interface ITest {
    input: IHeader,
    expected: APIGatewayProxyResult['multiValueHeaders'],
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
            foo: [1],
        },
    },
    {
        input: {
            foo: '1',
        },
        expected: {
            foo: ['1'],
        },
    },
    {
        input: {
            foo: ['1'],
        },
        expected: {
            foo: ['1'],
        },
    },
    {
        input: {
            foo: ['1', 0, undefined, null],
        },
        expected: {
            foo: ['1', 0],
        },
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} ${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        t.deepEqual(filterHeaders(input), expected);
    });
});
