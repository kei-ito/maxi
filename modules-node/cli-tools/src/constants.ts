import * as fs from 'fs';
import * as path from 'path';

export const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')) as {
    dependencies: {
        '@maxi-js/config-validator': string,
    },
};
