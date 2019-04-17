import {APIGatewayProxyHandler} from 'aws-lambda';
import {request} from './util/request';
import {asString} from './util/streamReader';
import {getMatchedStrings} from './util/getMatchedStrings';
import {filterHeadersForAPIGateway} from './util/filterHeadersForAPIGateway';
import {getTableFromHTML} from './util/getTableFromHTML';
import {stringifyTable} from './util/stringifyTable';
import {ITableLike} from './types';
import {createErrorResponse} from './util/createErrorResponse';
import {generateCORSHeaders} from './util/generateCORSHeaders';

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

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const response = await request('http://maxi.riken.jp/pubdata/v3/', asString);
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
            ...generateCORSHeaders(event),
            'content-length': body.length,
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'max-age=43200',
        },
        body,
    };
};
