import * as path from 'path';
import * as assert from 'assert';
import {IMAXIJSRootPackageJSON} from './types';

export const validateRootPackageJSON = async (
    rootPackageJSON: IMAXIJSRootPackageJSON,
    packageDirectoryList: Array<string>,
): Promise<void> => {
    assert.deepEqual(
        new Set(Object.keys(rootPackageJSON)),
        new Set([
            'private',
            'license',
            'scripts',
            'devDependencies',
            'eslintConfig',
            'ava',
            'commitlint',
            'husky',
            'renovate-config',
        ]),
        `The package.json at the root directory is invalid.`,
    );
    assert.equal(
        rootPackageJSON.private,
        true,
        `(package.json).private is invalid: ${rootPackageJSON.private}`,
    );
    assert.equal(
        typeof rootPackageJSON.license,
        'string',
        `(package.json).license is invalid: ${rootPackageJSON.license}`,
    );
    assert.ok(
        rootPackageJSON.commitlint.rules['scope-enum'][2].includes('deps'),
        '(package.json).commitlint.rules.scope-enum[2] should include "deps".',
    );
    assert.ok(
        rootPackageJSON.commitlint.rules['scope-enum'][2].includes('repo'),
        '(package.json).commitlint.rules.scope-enum[2] should include "repo".',
    );
    const allowedScopeList = rootPackageJSON.commitlint.rules['scope-enum'][2];
    packageDirectoryList
    .map((packageDirectory) => path.basename(packageDirectory))
    .concat('deps', 'repo')
    .forEach((scope) => {
        assert.ok(
            allowedScopeList.includes(scope),
            `(package.json).commitlint.rules.scope-enum[2] should include "${scope}".`,
        );
    });
};
