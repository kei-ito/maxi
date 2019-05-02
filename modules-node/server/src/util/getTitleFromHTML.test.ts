import test from 'ava';
import {getTitleFromHTML} from './getTitleFromHTML';

interface ITest {
    input: string,
    expected: string,
}

([
    {
        input: '',
        expected: '',
    },
    {
        input: '<title>\n \tA </title',
        expected: 'A',
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} getTitleFromHTML(${JSON.stringify(input)}) → ${JSON.stringify(expected)}`, (t) => {
        const actual = getTitleFromHTML(input);
        t.deepEqual(actual, expected);
    });
});
