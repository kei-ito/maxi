import * as path from 'path';
import globby from 'globby';
import {validatePackageJSON} from './validatePackageJSON';
import {readJSON} from './readJSON';
import {IMAXIJSLernaJSON, IMAXIJSRootPackageJSON, IMAXIJSPackageJSON} from './types';
import {validateLernaJSON} from './validateLernaJSON';
import {validateRootPackageJSON} from './validateRootPackageJSON';

export const validatePackages = async (
    lernaProjectDirectory: string,
): Promise<void> => {
    const [lernaJSONData, rootPackageJSON] = await Promise.all([
        readJSON<IMAXIJSLernaJSON>(path.join(lernaProjectDirectory, 'lerna.json')),
        readJSON<IMAXIJSRootPackageJSON>(path.join(lernaProjectDirectory, 'package.json')),
    ]);
    await validateLernaJSON(lernaJSONData);
    await validateRootPackageJSON(rootPackageJSON);
    const packageDirectoryList = await globby(
        lernaJSONData.packages.map((pattern) => path.join(lernaProjectDirectory, pattern)),
        {onlyDirectories: true},
    );
    await Promise.all(packageDirectoryList.map(async (packageDirectory) => {
        const packageJSONPath = path.join(packageDirectory, 'package.json');
        const packageJSON = await readJSON<IMAXIJSPackageJSON>(packageJSONPath);
        await validatePackageJSON(
            lernaProjectDirectory,
            lernaJSONData,
            rootPackageJSON,
            packageDirectory,
            packageJSON,
        );
    }));
};
