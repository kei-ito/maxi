import * as path from 'path';
import {promises as afs} from 'fs';
import * as yaml from 'js-yaml';
import {IMAXIJSCircleCIConfig} from './types';

export const getCircleCIConfig = async (
    lernaProjectDirectory: string,
): Promise<IMAXIJSCircleCIConfig> => {
    const configYMLPath = path.join(lernaProjectDirectory, '.circleci/config.yml');
    const configYMLString = await afs.readFile(configYMLPath, 'utf8');
    const configYMLData = yaml.safeLoad(configYMLString) as IMAXIJSCircleCIConfig;
    return configYMLData;
};
