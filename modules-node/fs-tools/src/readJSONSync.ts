import * as fs from 'fs';

export const readJSONSync = <TType>(
    jsonPath: string,
): TType => {
    const packageJSONString = fs.readFileSync(jsonPath, 'utf8');
    const packageJSONData = JSON.parse(packageJSONString) as TType;
    return packageJSONData;
};
