import {getMatchedStrings} from './getMatchedStrings';

export const getTitleFromHTML = (
    html: string,
): string => (getMatchedStrings(html, /<title[^>]*?>([\s\S]*?)<\/title/gi)[0] || '').trim();
