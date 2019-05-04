import * as util from 'util';
import {request} from '@maxi-js/net-tools';
import {asString} from '@maxi-js/stream-tools';
import {getTableFromHTML, getTitleFromHTML} from '@maxi-js/string-tools';
import {catalogHTMLURL} from './constants';
import {IObjectCatalog, IObjectData} from '../src';
import * as currentCatalog from '../src/catalog';
import {getObjectData} from './getObjectData';
import {removeHeading} from './removeHeading';
import {getObjectIdAndName} from './getObjectIdAndName';

export const buildCatalog = async (
    stdout: NodeJS.WritableStream = process.stdout,
    stderr: NodeJS.WritableStream = process.stderr,
): Promise<IObjectCatalog | null> => {
    const response = await request(catalogHTMLURL, asString, {stdout});
    if (response.statusCode !== 200) {
        throw new Error(`GET ${catalogHTMLURL} returned ${response.statusCode}`);
    }
    const [table] = getTableFromHTML(response.body);
    if (!table) {
        throw new Error(`Failed to parse source table: ${response.body}`);
    }
    const coverageMap = new Map(currentCatalog.map);
    const addedObjects: Array<IObjectData> = [];
    const list: Array<IObjectData> = [];
    for (const row of removeHeading(table)) {
        try {
            const [id, name] = getObjectIdAndName(row);
            let object = coverageMap.get(id);
            coverageMap.delete(id);
            if (!object) {
                object = await getObjectData(row, stdout);
                stdout.write(`${name} (${id}) is added.\n`);
                addedObjects.push(object);
            }
            list.push(object);
            await new Promise((resolve) => setTimeout(resolve, 40));
        } catch (error) {
            if (stderr) {
                stderr.write(`${util.inspect(error)}\n`);
            } else {
                throw error;
            }
        }
    }
    coverageMap.forEach((object) => {
        stdout.write(`${object.name} (${object.id}) is deleted.\n`);
    });
    if (addedObjects.length === 0 && coverageMap.size === 0) {
        return null;
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
