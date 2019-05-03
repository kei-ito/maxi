import {getMatchedStrings} from '@maxi-js/string-tools';
import {dataBaseURL} from './constants';

export const getImageURLFromHTML = (
    id: string,
    html: string,
): URL => {
    const regexp = new RegExp(`="(${id.replace(/[^\w]/g, '\\$&')}\\w*?lc_all\\.gif)"`, 'g');
    const [imageFileName] = getMatchedStrings(html, regexp);
    return new URL(`${id}/${imageFileName}`, dataBaseURL);
};
