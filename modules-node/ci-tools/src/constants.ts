import * as fs from 'fs';
import * as path from 'path';
import {IMAXIJSPackageJSON} from './types';

export const repositoryURL = 'https://github.com/kei-ito/maxi';
export const repositoryTreeURL = 'https://github.com/kei-ito/maxi/tree/master';
export const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')) as IMAXIJSPackageJSON;
