"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const getMatchedStrings_1 = require("./getMatchedStrings");
[
    {
        regexp: /a/,
        tests: [
            { input: '', expected: [] },
        ],
    },
    {
        regexp: /(a)/,
        tests: [
            { input: 'a', expected: ['a'] },
            { input: 'aa', expected: ['a'] },
        ],
    },
    {
        regexp: /(a)/gi,
        tests: [
            { input: 'aa', expected: ['a', 'a'] },
            { input: 'Aa', expected: ['A', 'a'] },
        ],
    },
].forEach(({ regexp, tests }, index1) => {
    tests.forEach(({ input, expected }, index2) => {
        ava_1.default(`#${index1}.${index2} getMatchedStrings(${input}, ${regexp}) → ${JSON.stringify(expected)}`, (t) => {
            const actual = getMatchedStrings_1.getMatchedStrings(input, regexp);
            t.deepEqual(actual, expected);
        });
    });
});
//# sourceMappingURL=getMatchedStrings.test.js.map