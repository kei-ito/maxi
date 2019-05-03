import {catalog as $catalog, IObjectData} from '@maxi-js/catalog';

export const catalog = {
    createdAt: new Date($catalog.createdAt),
    source: $catalog.source,
    firstObject: $catalog.list[0],
    map: new Map(
        $catalog.list.map<[string, IObjectData & {hash: string}]>((object) => [
            object.id,
            {
                ...object,
                hash: [
                    object.id,
                    object.name,
                    object.category,
                ].join(' '),
            },
        ]),
    ),
};
