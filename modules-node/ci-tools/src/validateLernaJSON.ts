import * as assert from 'assert';
import {IMAXIJSLernaJSON} from './types';

export const validateLernaJSON = async (
    lernaJSON: IMAXIJSLernaJSON,
): Promise<void> => {
    assert.deepEqual(
        new Set(Object.keys(lernaJSON)),
        new Set(['version', 'packages', 'command']),
        'The lerna.json is invalid.',
    );
    const {version, packages, command} = lernaJSON;
    assert.ok(
        (/^\d+\.\d+\.\d+$/).test(version),
        `(lerna.json).version is invalid: ${version}.`,
    );
    assert.ok(
        Array.isArray(packages),
        `(lerna.json).packages is invalid: ${packages}.`,
    );
    packages.forEach((pattern, index) => {
        assert.equal(
            typeof pattern, 'string',
            `(lerna.json).packages[${index}] is invalid: ${pattern}.`,
        );
    });
    if (command) {
        const {publish, bootstrap} = command;
        if (publish) {
            const {allowBranch, ignoreChanges, message} = publish;
            if (allowBranch) {
                assert.equal(
                    allowBranch,
                    'master',
                    `(lerna.json).command.allowBranch is invalid: ${allowBranch}.`,
                );
            }
            if (ignoreChanges) {
                assert.ok(
                    Array.isArray(ignoreChanges),
                    `(lerna.json).command.ignoreChanges is invalid: ${ignoreChanges}.`,
                );
                ignoreChanges.forEach((pattern, index) => {
                    assert.equal(
                        typeof pattern,
                        'string',
                        `(lerna.json).command.ignoreChanges[${index}] is invalid: ${pattern}.`,
                    );
                });
            }
            if (message) {
                assert.equal(
                    typeof message,
                    'string',
                    `(lerna.json).command.message is invalid: ${message}.`,
                );
            }
        }
        if (bootstrap) {
            const {ignore, npmClientArgs, scope} = bootstrap;
            if (ignore) {
                assert.equal(
                    typeof ignore,
                    'string',
                    `(lerna.json).bootstrap.ignore is invalid: ${ignore}.`,
                );
            }
            if (npmClientArgs) {
                assert.ok(
                    Array.isArray(npmClientArgs),
                    `(lerna.json).bootstrap.npmClientArgs is invalid: ${npmClientArgs}.`,
                );
                npmClientArgs.forEach((arg, index) => {
                    assert.equal(
                        typeof arg,
                        'string',
                        `(lerna.json).bootstrap.npmClientArgs[${index}] is invalid: ${arg}.`,
                    );
                });
            }
            if (scope) {
                assert.ok(
                    Array.isArray(scope),
                    `(lerna.json).bootstrap.scope is invalid: ${scope}.`,
                );
                scope.forEach((name, index) => {
                    assert.equal(
                        typeof name,
                        'string',
                        `(lerna.json).bootstrap.scope[${index}] is invalid: ${name}.`,
                    );
                });
            }
        }
    }
};
