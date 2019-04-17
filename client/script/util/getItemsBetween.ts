import {iterate} from './iterate';

export const getItemsBetween = <TItem extends {id: string}>(
    endId1: string,
    endId2: string,
    items: Iterator<TItem>,
): Array<TItem> => {
    const result: Array<TItem> = [];
    if (endId1 !== endId2) {
        const targets = new Set([endId1, endId2]);
        iterate(items, (item) => {
            const id = item.id;
            const isAtEnd = targets.has(id);
            if (0 < result.length) {
                result.push(item);
                if (isAtEnd) {
                    return true;
                }
            } else if (isAtEnd) {
                result.push(item);
                targets.delete(id);
            }
            return false;
        });
    }
    return result;
};
