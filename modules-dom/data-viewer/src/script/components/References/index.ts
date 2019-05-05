import {createElement, memo} from 'react';
import {ILightCurveData} from '../../types';
import * as catalog from '../../util/catalog';

export interface IReferencesProps {
    selected: Array<string>,
    lightCurveCache: Map<string, ILightCurveData>,
}

export const References = memo((
    {
        selected,
        lightCurveCache,
    }: IReferencesProps,
) => {
    return createElement(
        'ol',
        null,
        createElement(
            'li',
            {id: 'List'},
            `${catalog.source.title}. Retrieved ${catalog.createdAt.toLocaleString()}. `,
            createElement(
                'a',
                {href: catalog.source.urls.html, target: '_blank'},
                catalog.source.urls.html,
            ),
        ),
        ...selected.map((objectId) => {
            const data = lightCurveCache.get(objectId);
            return createElement(
                'li',
                {id: `Source-${objectId}`},
                `${data ? `${data.sourceTitle}. Retrieved ${data.createdAt.toLocaleString()}` : objectId}. `,
                createElement(
                    'a',
                    {href: data && data.sourceURL, target: '_blank'},
                    data ? data.sourceURL : 'Loading...',
                ),
            );
        }),
        createElement(
            'li',
            {id: 'Source-GitHub'},
            'Source code of this app. ',
            createElement(
                'a',
                {href: 'https://github.com/kei-ito/maxi', target: '_blank'},
                'https://github.com/kei-ito/maxi',
            ),
        ),
    );
});
