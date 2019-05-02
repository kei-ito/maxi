import * as path from 'path';
import {readJSONSync} from '@maxi-js/fs-tools';

export const packageJSONPath = path.join(__dirname, '../package.json');
export const packageJSON = readJSONSync<{
    bin: {
        [name: string]: string | undefined,
    },
    dependencies: {
        '@maxi-js/config-validator': string,
    },
}>(packageJSONPath);
