import test, {ThrowsExpectation} from 'ava';
import {validatePerson} from './validatePerson';

interface ITest {
    person: {
        [key: string]: string | undefined,
    },
    objectName: string,
    fail?: ThrowsExpectation,
}

([
    {
        person: {},
        objectName: 'foo',
        fail: {message: /^foo\.email is invalid/},
    },
    {
        person: {
            email: 'foo@example.com',
        },
        objectName: 'foo',
        fail: {message: /^foo\.name is invalid/},
    },
    {
        person: {
            email: 'foo@example.com',
            name: 'foo',
        },
        objectName: 'foo',
    },
    {
        person: {
            email: 'foo@example.com',
            name: 'foo',
            url: 'example.com',
        },
        objectName: 'foo',
        fail: {message: /^foo\.url is invalid/},
    },
    {
        person: {
            email: 'foo@example.com',
            name: 'foo',
            url: 'https://example.com/',
        },
        objectName: 'foo',
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

