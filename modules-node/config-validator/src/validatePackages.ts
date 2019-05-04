import * as path from 'path';
import {readJSON} from '@maxi-js/fs-tools';
import {validatePackageJSON} from './validatePackageJSON';
import {IMAXIJSLernaJSON, IMAXIJSRootPackageJSON, IMAXIJSPackageJSON} from './types';
import {validateLernaJSON} from './validateLernaJSON';
import {validateRootPackageJSON} from './validateRootPackageJSON';
import {getCircleCIConfig} from './getCircleCIConfig';
import {getPackageDirectoryList} from './getPackageDirectoryList';
import {validateCircleCIConfiguration} from './validateCircleCIConfiguration';

export const validatePackages = async (
    lernaProjectDirectory: string,
): Promise<void> => {
    const [lernaJSON, rootPackageJSON, circleCIConfig] = await Promise.all([
        readJSON<IMAXIJSLernaJSON>(path.join(lernaProjectDirectory, 'lerna.json')),
        readJSON<IMAXIJSRootPackageJSON>(path.join(lernaProjectDirectory, 'package.json')),
        getCircleCIConfig(lernaProjectDirectory),
    ]);
    const packageDirectoryList = await getPackageDirectoryList(lernaJSON.packages, lernaProjectDirectory);
    await Promise.all([
        validateLernaJSON(lernaJSON),
        validateRootPackageJSON(rootPackageJSON, packageDirectoryList),
        validateCircleCIConfiguration(circleCIConfig, packageDirectoryList),
        ...packageDirectoryList.map(async (packageDirectory) => {
            const packageJSONPath = path.join(packageDirectory, 'package.json');
            const packageJSON = await readJSON<IMAXIJSPackageJSON>(packageJSONPath);
            await validatePackageJSON({
                lernaProjectDirectory,
                lernaJSON,
                rootPackageJSON,
                packageDirectory,
                packageJSON,
            });
        }),
    ]);
};
