import * as assert from 'assert';
import {IPerson} from './types';

export const validatePerson = (
    person: IPerson,
    objectName: string,
) => {
    assert.equal(
        typeof person,
        'object',
        `${objectName} is invalid: ${person}.`,
    );
    const {name, email, url} = person;
    assert.equal(
        typeof email,
        'string',
        `${objectName}.email is invalid: ${email}.`,
    );
    assert.equal(
        typeof name,
        'string',
        `${objectName}.name is invalid: ${name}.`,
    );
    if (url) {
        assert.equal(
            typeof url,
            'string',
            `${objectName}.url is invalid: ${url}.`,
        );
    }
};
