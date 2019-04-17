"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const getTableFromHTML_1 = require("./getTableFromHTML");
[
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
].forEach(({ input, expected }, index) => {
    ava_1.default(`#${index} getTableFromHTML(${JSON.stringify(input)}) → ${JSON.stringify(expected)}`, (t) => {
        const actual = getTableFromHTML_1.getTableFromHTML(input);
        t.deepEqual(actual, expected);
    });
});
//# sourceMappingURL=getTableFromHTML.test.js.map