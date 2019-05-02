import test from 'ava';
import {validatePerson} from './validatePerson';

interface ITest {
    person: {
        [key: string]: string | undefined,
    },
    objectName: string,
    fail: false | string,
}

([
    {
        person: {},
        objectName: 'foo',
        fail: /^foo\.email is invalid/,
    },
    {
        person: {
            email: 'foo@example.com',
        },
        objectName: 'foo',
        fail: /^foo\.name is invalid/,
    },
    {
        person: {
            email: 'foo@example.com',
            name: 'foo',
        },
        objectName: 'foo',
        fail: false,
    },
    {
        person: {
            email: 'foo@example.com',
            name: 'foo',
            url: 'example.com',
        },
        objectName: 'foo',
        fail: /^foo\.url is invalid/,
    },
    {
        person: {
            email: 'foo@example.com',
            name: 'foo',
            url: 'https://example.com/',
        },
        objectName: 'foo',
        fail: false,
    },
] as Array<ITest>).forEach(({person, objectName, fail}) => {
    test(`${JSON.stringify(person)} → ${fail || 'pass'}`, (t) => {
        if (fail) {
            t.throws(() => validatePerson(person, objectName), fail);
        } else {
            t.notThrows(() => validatePerson(person, objectName));
        }
    });
});

