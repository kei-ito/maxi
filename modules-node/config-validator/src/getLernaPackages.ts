import * as path from 'path';
import {promises as afs} from 'fs';
import globby from 'globby';
import {IMAXIJSLernaJSON} from './types';

export const getLernaPackages = async (
    lernaProjectDirectory: string,
): Promise<Array<string>> => {
    const lernaJSONPath = path.join(lernaProjectDirectory, 'lerna.json');
    const lernaJSONString = await afs.readFile(lernaJSONPath, 'utf8');
    const lernaJSONData = JSON.parse(lernaJSONString) as IMAXIJSLernaJSON;
    return (await Promise.all(lernaJSONData.packages.map(async (pattern) => {
        const absolutePattern = path.join(lernaProjectDirectory, pattern);
        return globby(absolutePattern, {onlyDirectories: true});
    })))
    .reduce((a, b) => a.concat(b));
};
