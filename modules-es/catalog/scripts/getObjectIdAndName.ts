import {getMatchedStrings} from '@maxi-js/string-tools';

export const getObjectIdAndName = (
    row: Array<string>,
): [string, string] => {
    const [id, name] = getMatchedStrings(row[1], /href="([\w+-]*?)\/[^>]*>([^<]*?)</g);
    return [id, name];
};
