import * as util from 'util';
import {request} from '@maxi-js/net-tools';
import {asString} from '@maxi-js/stream-tools';
import {getTableFromHTML, getTitleFromHTML} from '@maxi-js/string-tools';
import {catalogHTMLURL} from './constants';
import {IObjectCatalog, IObjectData} from '../src/types';
import {getObjectData} from './getObjectData';
import {removeHeading} from './removeHeading';

export const buildCatalog = async (
    stdout: NodeJS.WritableStream = process.stdout,
    stderr: NodeJS.WritableStream = process.stderr,
): Promise<IObjectCatalog> => {
    const response = await request(catalogHTMLURL, asString, {stdout});
    if (response.statusCode !== 200) {
        throw new Error(`GET ${catalogHTMLURL} returned ${response.statusCode}`);
    }
    const [table] = getTableFromHTML(response.body);
    if (!table) {
        throw new Error(`Failed to parse source table: ${response.body}`);
    }
    const list: Array<IObjectData> = [];
    for (const row of removeHeading(table)) {
        try {
            list.push(await getObjectData(row, stdout));
            await new Promise((resolve) => setTimeout(resolve, 40));
        } catch (error) {
            if (stderr) {
                stderr.write(`${util.inspect(error)}\n`);
            } else {
                throw error;
            }
        }
    }
    return {
        list,
        createdAt: new Date().toISOString(),
        source: {
            title: getTitleFromHTML(response.body),
            urls: {
                html: `${catalogHTMLURL}`,
            },
        },
    };
};
