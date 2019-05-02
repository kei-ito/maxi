import {ITableLike} from '../types';

export const stringifyTable = <TType>(
    table: ITableLike<TType>,
): string => `[\n${table.map((row) => `  ${JSON.stringify(row)}`).join(',\n')}\n]`;
