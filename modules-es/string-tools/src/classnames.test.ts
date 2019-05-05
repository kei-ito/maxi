import test from 'ava';
import {classnames} from './classnames';

interface ITest {
    input: Parameters<typeof classnames>,
    expected: ReturnType<typeof classnames>,
}

([
    {input: [], expected: ''},
    {input: ['foo'], expected: 'foo'},
    {input: ['foo', null], expected: 'foo'},
    {input: ['foo', null, false], expected: 'foo'},
    {input: ['foo', null, false, ''], expected: 'foo'},
    {input: ['foo', null, false, undefined, ''], expected: 'foo'},
    {input: ['foo', null, false, undefined, '', 'bar'], expected: 'foo bar'},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`classnames(${JSON.stringify(input).slice(1, -1)}) → ${JSON.stringify(expected)}`, (t) => {
        const actual = classnames(...input);
        t.deepEqual(actual, expected);
    });
});
