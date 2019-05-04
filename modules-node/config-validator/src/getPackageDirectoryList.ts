import * as path from 'path';
import globby from 'globby';

export const getPackageDirectoryList = (
    patterns: Array<string>,
    directory = process.cwd(),
): Promise<Array<string>> => globby(
    patterns.map((pattern) => path.join(directory, pattern)),
    {onlyDirectories: true},
);
