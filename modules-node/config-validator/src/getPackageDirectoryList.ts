import * as path from 'path';
import globby from 'globby';

export const getPackageDirectoryList = async (
    patterns: Array<string>,
    directory = process.cwd(),
): Promise<Array<string>> => (await globby(
    patterns.map((pattern) => path.join(directory, pattern)),
    {onlyDirectories: true},
))
.sort();
