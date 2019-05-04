import * as util from 'util';
import * as path from 'path';
import $rimraf from 'rimraf';
import {promises as afs} from 'fs';
import globby from 'globby';
const rimraf = util.promisify($rimraf);

const copyLayerFiles = async (
    projectDirectory = process.cwd(),
) => {
    await rimraf(path.join(projectDirectory, 'layer'));
    const files = await globby(
        path.join(projectDirectory, 'node_modules/**/*.{js,html}'),
        {
            ignore: [
                path.join(projectDirectory, 'node_modules/@maxi-js/data-viewer/node_modules/**/*'),
                '**/*.test.js',
            ],
        },
    );
    while (0 < files.length) {
        const filesToBeProcessed = files.splice(0, 10);
        await Promise.all(filesToBeProcessed.map(async (file) => {
            const relativePath = path.relative(projectDirectory, file);
            const destination = path.join(projectDirectory, 'layer/nodejs', relativePath);
            await afs.mkdir(path.dirname(destination), {recursive: true});
            await afs.copyFile(file, destination);
        }));
    }
};

if (!module.parent) {
    copyLayerFiles()
    .catch((error) => {
        process.stderr.write(`${util.inspect(error)}\n`);
        process.exit(1);
    });
}
