import test from 'ava';
import {packageJSON} from './constants';

test('defined in package.json', (t) => {
    const commandName = 'validate-packages';
    const relativePath = `lib/${commandName}.js`;
    t.is(packageJSON.bin[commandName], relativePath);
});
