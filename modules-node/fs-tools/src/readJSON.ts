import {promises as afs} from 'fs';

export const readJSON = async <TType>(
    jsonPath: string,
): Promise<TType> => {
    const packageJSONString = await afs.readFile(jsonPath, 'utf8');
    const packageJSONData = JSON.parse(packageJSONString) as TType;
    return packageJSONData;
};
