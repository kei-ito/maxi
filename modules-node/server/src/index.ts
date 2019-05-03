import {URL} from 'url';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {request} from '@maxi-js/net-tools';
import {asString} from '@maxi-js/stream-tools';
import {getMatchedStrings, stringifyTable, getTitleFromHTML, getTableFromHTML} from '@maxi-js/string-tools';
import {filterHeadersForAPIGateway} from './filterHeadersForAPIGateway';
import {ITableLike} from './types';
import {createErrorResponse} from './createErrorResponse';
import {generateCommonHeaders} from './generateCommonHeaders';

const removeHeading = <TType>(
    table: ITableLike<TType>,
): ITableLike<TType> => table.slice(1);

const fillIdAndName = (
    row: Array<string>,
): [string, string, string, string, string, string, string] => {
    const [id, name] = getMatchedStrings(row[1], /href="([\w+-]*?)\/[^>]*>([^<]*?)</g);
    return [
        id,
        name,
        row[6],
        row[2],
        row[3],
        row[4],
        row[5],
    ];
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const sourceURL = new URL('http://maxi.riken.jp/pubdata/v3/');
    const response = await request(sourceURL, asString);
    if (response.statusCode !== 200) {
        return createErrorResponse(response);
    }
    const [table] = getTableFromHTML(response.body);
    if (!table) {
        throw new Error(`Failed to parse source table: ${response.body}`);
    }
    const body = stringifyTable(removeHeading(table).map(fillIdAndName));
    return {
        statusCode: 200,
        headers: {
            ...filterHeadersForAPIGateway(response.headers),
            ...generateCommonHeaders(event, context, {
                'x-source-title': getTitleFromHTML(response.body),
                'x-source-url': `${sourceURL}`,
            }),
            'content-length': body.length,
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'max-age=43200',
        },
        body,
    };
};
