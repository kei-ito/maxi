import {request} from '@maxi-js/net-tools';
import {asString} from '@maxi-js/stream-tools';
import {getMatchedStrings, getTitleFromHTML} from '@maxi-js/string-tools';
import {dataBaseURL} from './constants';
import {IObjectData} from '../src/types';
import {getDataURLFromHTML} from './getDataURLFromHTML';
import {getImageURLFromHTML} from './getImageURLFromHTML';

export const getObjectData = async (
    row: Array<string>,
    stdout: NodeJS.WritableStream = process.stdout,
): Promise<IObjectData> => {
    const [id, name] = getMatchedStrings(row[1], /href="([\w+-]*?)\/[^>]*>([^<]*?)</g);
    const category = row[6];
    const ra = Number(row[2]);
    const dec = Number(row[3]);
    const l = Number(row[4]);
    const b = Number(row[5]);
    const sourceHTMLURL = new URL(`${id}/${id}.html`, dataBaseURL);
    const response = await request(sourceHTMLURL, asString, {stdout});
    if (response.statusCode !== 200) {
        throw new Error(`GET ${sourceHTMLURL} returned ${response.statusCode}`);
    }
    return {
        id,
        name,
        category,
        ra,
        dec,
        l,
        b,
        source: {
            title: getTitleFromHTML(response.body),
            urls: {
                html: `${sourceHTMLURL}`,
                image: `${getImageURLFromHTML(id, response.body)}`,
                data: `${getDataURLFromHTML(id, response.body)}`,
            },
        },
    };
};
