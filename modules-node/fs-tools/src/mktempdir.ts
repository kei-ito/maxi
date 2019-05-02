import * as os from 'os';
import * as path from 'path';
import {promises as afs} from 'fs';

export const mktempdir = async (
    prefix: string = 'temp',
): Promise<string> => {
    const directory = await afs.mkdtemp(path.join(os.tmpdir(), `${prefix}-`));
    const realpath = await afs.realpath(directory);
    return realpath;
};
