import {getMatchedStrings} from '@maxi-js/string-tools';
import {dataBaseURL} from './constants';

export const getDataURLFromHTML = (
    id: string,
    html: string,
): URL => {
    const regexp = new RegExp(`="(${id.replace(/[^\w]/g, '\\$&')}\\w*?1day_all\\.dat)"`, 'g');
    const [dataFileName] = getMatchedStrings(html, regexp);
    return new URL(`${id}/${dataFileName}`, dataBaseURL);
};
