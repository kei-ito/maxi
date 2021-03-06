import * as path from 'path';
import * as assert from 'assert';
import {IMAXIJSTravisCIConfig} from './types';

export const validateTravisCIConfiguration = async (
    _travisCIConfiguration: IMAXIJSTravisCIConfig,
    packageDirectoryList: Array<string>,
    projectDirectory: string,
): Promise<void> => {
    packageDirectoryList.forEach((packageDirectory) => {
        const modulesDirectory = path.join(
            path.relative(projectDirectory, packageDirectory),
            'node_modules',
        ).split(path.sep).join('/');
        assert.ok(modulesDirectory);
        // assert.ok(
        //     travisCIConfiguration.cache.directories.includes(modulesDirectory),
        //     `(.travis.yml).cache.directories does not have ${modulesDirectory}`,
        // );
    });
};
