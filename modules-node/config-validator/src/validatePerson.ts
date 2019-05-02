import * as assert from 'assert';
import {URL} from 'url';
import {IPerson} from './types';

export const validatePerson = (
    person: Partial<IPerson>,
    objectName: string,
): void => {
    assert.equal(
        typeof person,
        'object',
        `${objectName} is invalid: ${person}.`,
    );
    assert.ok(
        typeof person.email === 'string' && (/^[^@]+@[^@]+$/).test(person.email),
        `${objectName}.email is invalid: ${person.email}.`,
    );
    assert.ok(
        typeof person.name === 'string' && person.name === person.name.trim(),
        `${objectName}.name is invalid: ${person.name}.`,
    );
    if (person.url) {
        let url: URL | null = null;
        try {
            url = new URL(person.url);
        } catch (error) {
            url = null;
        }
        assert.ok(
            person.url === `${url}`,
            `${objectName}.url is invalid: ${person.url}.`,
        );
    }
};
