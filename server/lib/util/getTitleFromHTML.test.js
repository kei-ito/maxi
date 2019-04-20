"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const getTitleFromHTML_1 = require("./getTitleFromHTML");
[
    {
        input: '',
        expected: '',
    },
    {
        input: '<title>\n \tA </title',
        expected: 'A',
    },
].forEach(({ input, expected }, index) => {
    ava_1.default(`#${index} getTitleFromHTML(${JSON.stringify(input)}) → ${JSON.stringify(expected)}`, (t) => {
        const actual = getTitleFromHTML_1.getTitleFromHTML(input);
        t.deepEqual(actual, expected);
    });
});
//# sourceMappingURL=getTitleFromHTML.test.js.map