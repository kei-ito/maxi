import * as $catalog from '@maxi-js/catalog';

export const createdAt = new Date($catalog.createdAt);
export const source = $catalog.source;
export let firstObjectId = '';
export const map = new Map(
    Array.from($catalog.map).map<[string, $catalog.IObjectData & {hash: string}]>(([, object], index) => {
        if (index === 0) {
            firstObjectId = object.id;
        }
        return [
            object.id,
            {
                ...object,
                hash: [
                    object.id,
                    object.name,
                    object.category,
                ].join(' '),
            },
        ];
    }),
);
