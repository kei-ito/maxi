import {IObjectCatalog} from '../src/types';

export const stringifyCatalog = (
    catalog: IObjectCatalog,
): string => {
    return [
        'import {IObjectCatalog} from \'./types\';',
        'export const catalog: IObjectCatalog = {',
        `    createdAt: '${catalog.createdAt}',`,
        '    source: {',
        `        title: '${catalog.source.title}',`,
        `        urls: {html: '${catalog.source.urls.html}'},`,
        '    },',
        '    list: [',
        ...catalog.list.map((object) => [
            '        {',
            `            id: '${object.id}',`,
            `            name: '${object.name}',`,
            `            category: '${object.category}',`,
            `            ra: ${object.ra},`,
            `            dec: ${object.dec},`,
            `            l: ${object.l},`,
            `            b: ${object.b},`,
            '            source: {',
            `                title: '${object.source.title}',`,
            '                urls: {',
            `                    html: '${object.source.urls.html}',`,
            `                    image: '${object.source.urls.image}',`,
            `                    data: '${object.source.urls.data}',`,
            '                },',
            '            },',
            '        },',
        ].join('\n')),
        '    ],',
        '};',
        '',
    ].join('\n');
};
