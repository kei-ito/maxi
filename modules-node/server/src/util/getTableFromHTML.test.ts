import test from 'ava';
import {getTableFromHTML} from './getTableFromHTML';

interface ITest {
    input: string,
    expected: Array<Array<Array<string>>>,
}

([
    {
        input: '',
        expected: [],
    },
    {
        input: '<table></table>',
        expected: [[]],
    },
    {
        input: '<table><tr></tr></table>',
        expected: [[[]]],
    },
    {
        input: [
            '<table>',
            '<tr>',
            '<th>aaa</th>',
            '<td>bbb</td>',
            '</tr>',
            '<tr>',
            '<th>ccc</th>',
            '<td>ddd</td>',
            '</tr>',
            '</table>',
            '<table>',
            '<tr>',
            '<th>eee</th>',
            '<td>fff</td>',
            '</tr>',
            '</table>',
        ].join('\n'),
        expected: [
            [
                ['aaa', 'bbb'],
                ['ccc', 'ddd'],
            ],
            [
                ['eee', 'fff'],
            ],
        ],
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} getTableFromHTML(${JSON.stringify(input)}) → ${JSON.stringify(expected)}`, (t) => {
        const actual = getTableFromHTML(input);
        t.deepEqual(actual, expected);
    });
});
