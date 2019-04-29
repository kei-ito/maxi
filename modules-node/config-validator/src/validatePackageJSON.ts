import * as path from 'path';
import * as assert from 'assert';
import * as semver from 'semver';
import {IMAXIJSPackageJSON, IMAXIJSLernaJSON, IMAXIJSRootPackageJSON} from './types';
import {repositoryURL, repositoryTreeURL} from './constants';
import {validatePerson} from './validatePerson';

export const validatePackageJSON = async (
    lernaProjectDirectory: string,
    lernaJSON: IMAXIJSLernaJSON,
    rootPackageJSON: IMAXIJSRootPackageJSON,
    packageDirectory: string,
    packageJSON: IMAXIJSPackageJSON,
): Promise<void> => {
    const relativePath = path.relative(lernaProjectDirectory, packageDirectory);
    assert.equal(
        packageJSON.name,
        `@maxi-js/${path.basename(packageDirectory)}`,
        `(${relativePath}).name is invalid: ${packageJSON.name}`,
    );
    assert.ok(
        (/^\d+\.\d+\.\d+$/).test(packageJSON.version),
        `(${relativePath}).version is invalid: ${packageJSON.version}`,
    );
    assert.ok(
        semver.lte(packageJSON.version, lernaJSON.version),
        `(${relativePath}).version is invalid: ${packageJSON.version}`,
    );
    assert.equal(
        packageJSON.license,
        rootPackageJSON.license,
        `(${relativePath}).license is invalid: ${packageJSON.license}`,
    );
    validatePerson(packageJSON.author, `(${relativePath}).author`);
    if (packageJSON.contributors) {
        assert.ok(
            Array.isArray(packageJSON.contributors),
            `(${relativePath}).contributors is invalid: ${packageJSON.contributors}`,
        );
        packageJSON.contributors.forEach((contributor, index) => {
            validatePerson(contributor, `(${relativePath}).contributors[${index}]`);
        });
    }
    assert.equal(
        packageJSON.homepage,
        `${repositoryTreeURL}/${relativePath.split(path.sep).join('/')}`,
        `(${relativePath}).homepage is invalid: ${packageJSON.homepage}`,
    );
    assert.equal(
        packageJSON.repository,
        repositoryURL,
        `(${relativePath}).repository is invalid: ${packageJSON.repository}`,
    );
    assert.equal(
        typeof packageJSON.publishConfig,
        'object',
        `(${relativePath}).publishConfig is invalid: ${packageJSON.publishConfig}`,
    );
    assert.equal(
        packageJSON.publishConfig.access,
        'public',
        `(${relativePath}).publishConfig.access is invalid: ${packageJSON.publishConfig.access}`,
    );
    if (packageJSON.engines) {
        assert.equal(
            typeof packageJSON.engines,
            'object',
            `(${relativePath}).engines is invalid: ${packageJSON.engines}`,
        );
        assert.equal(
            packageJSON.engines.node,
            '>=10.0.0',
            `(${relativePath}).engines.node is invalid: ${packageJSON.engines.node}`,
        );
    }
    assert.equal(
        typeof packageJSON.main,
        'string',
        `(${relativePath}).main is invalid: ${packageJSON.main}`,
    );
    assert.ok(
        Array.isArray(packageJSON.files),
        `(${relativePath}).files is invalid: ${packageJSON.files}`,
    );
    packageJSON.files.forEach((pattern, index) => {
        assert.equal(
            typeof pattern,
            'string',
            `(${relativePath}).files[${index}] is invalid: ${packageJSON.files[index]}`,
        );
    });
    assert.equal(
        typeof packageJSON.scripts,
        'object',
        `(${relativePath}).scripts is invalid: ${packageJSON.scripts}`,
    );
    assert.equal(
        typeof packageJSON.scripts.build,
        'string',
        `(${relativePath}).scripts.build is invalid: ${packageJSON.scripts.build}`,
    );
    assert.equal(
        typeof packageJSON.scripts.test,
        'string',
        `(${relativePath}).scripts.test is invalid: ${packageJSON.scripts.test}`,
    );
};
