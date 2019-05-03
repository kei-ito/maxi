import {ITableLike} from '@maxi-js/string-tools';

export const removeHeading = <TType>(
    table: ITableLike<TType>,
): ITableLike<TType> => table.slice(1);
