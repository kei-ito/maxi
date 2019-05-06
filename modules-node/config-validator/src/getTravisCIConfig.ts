import * as path from 'path';
import {promises as afs} from 'fs';
import * as yaml from 'js-yaml';
import {IMAXIJSTravisCIConfig} from './types';

export const getTravisCIConfig = async (
    lernaProjectDirectory: string,
): Promise<IMAXIJSTravisCIConfig> => {
    const configYMLPath = path.join(lernaProjectDirectory, '.travis.yml');
    const configYMLString = await afs.readFile(configYMLPath, 'utf8');
    const configYMLData = yaml.safeLoad(configYMLString) as IMAXIJSTravisCIConfig;
    return configYMLData;
};
