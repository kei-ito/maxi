import {useState, createElement, useEffect, Fragment, useReducer} from 'react';
import {getObjectMap} from '../../util/getObjectMap';
import {Mode, ILightCurveData, IError, IBinnedLightCurveData, IObjectMap, Band} from '../../types';
import {getLightCurveData} from '../../util/getData';
import {getBinnedLightCurveData} from '../../util/getBinnedLightCurveData';
import {useCache} from '../../util/useCache';
import {getDefaultPreferences} from '../../util/getDefaultPreferences';
import {URLParameterKey} from '../../util/constants';
import {ObjectList} from '../ObjectList/index';
import {Preferences} from '../Preferences/index';
import {LightCurve} from '../LightCurve/index';
import {SearchForm} from '../SearchForm/index';
import {normalizeSearchText} from '../../util/normalizeSearchText';

export const App = () => {
    const [errors, onError] = useReducer(
        (
            errors: Array<IError | Error>,
            newError: IError | Error,
        ) => errors.concat(newError),
        [],
    );
    const [preferences, setPreferences] = useState(getDefaultPreferences());
    const [objectMap, setObjectMap] = useState<IObjectMap | null>(null);
    const [searchWords, setSearchWords] = useState('');
    const [selected, setSelected] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(-1);
    const lightCurveCache = useCache<ILightCurveData>({
        keys: selected,
        getter: getLightCurveData,
        onError,
    });
    const binnedLightCurveCache = useCache<IBinnedLightCurveData>({
        keys: selected,
        getter: (objectId) => {
            const rawData = lightCurveCache.get(objectId);
            if (rawData) {
                return getBinnedLightCurveData(rawData, preferences.binSize);
            }
            return null;
        },
        onError,
        dependencies: [preferences.binSize, lightCurveCache],
    });

    useEffect(() => {
        if (loading === -1 && !objectMap) {
            setLoading(1);
            getObjectMap()
            .then((newObjectMap) => {
                const urlParameters = new URLSearchParams(location.search);
                const requestedObjects = urlParameters.get(URLParameterKey.selected);
                if (requestedObjects) {
                    setSelected(
                        requestedObjects.trim().split(/\s*,\s*/)
                        .filter((objectId) => newObjectMap.has(objectId)),
                    );
                } else {
                    const newObjects: Array<string> = [];
                    newObjectMap.forEach((_, objectId) => {
                        newObjects.push(objectId);
                    });
                    setSelected(newObjects.slice(0, 1));
                }
                setObjectMap(newObjectMap);
                setLoading(0);
            })
            .catch(onError);
        }
    }, []);

    useEffect(() => {
        if (loading === 0) {
            const urlParameters = new URLSearchParams();
            const selectedObjectsCSV = selected.join(',');
            urlParameters.set(URLParameterKey.selected, selectedObjectsCSV);
            urlParameters.set(URLParameterKey.binSize, `${preferences.binSize}`);
            const url = new URL(location.href);
            url.search = `${urlParameters}`;
            history.replaceState(null, selectedObjectsCSV, `${url}`);
        }
    }, [selected, preferences, loading]);

    return createElement(
        Fragment,
        null,
        createElement('header', null, createElement('h1', null, 'MAXI GSC Data Viewer')),
        createElement(
            'article',
            null,
            createElement('h1', null, [
                'Object selector',
                objectMap ? `(${objectMap.size} object${objectMap.size === 0 ? '' : 's'})` : '(Loading...)',
            ].join(' ')),
            createElement(
                'figure',
                null,
                createElement(
                    SearchForm,
                    {
                        label: 'Search for:',
                        placeholder: 'All (Click here to change)',
                        defaultValue: '',
                        onChange: (words) => setSearchWords(normalizeSearchText(words)),
                    },
                ),
                createElement(ObjectList, {
                    loading: loading !== 0,
                    searchWords,
                    objectMap,
                    selected,
                    onSelect: (object, mode) => {
                        const newSelected = new Set(selected);
                        const targetObjects = [object];
                        if (mode !== Mode.Append) {
                            newSelected.clear();
                        }
                        if (newSelected.has(object.id)) {
                            for (const {id} of targetObjects) {
                                newSelected.delete(id);
                            }
                        } else {
                            for (const {id} of targetObjects) {
                                newSelected.add(id);
                            }
                        }
                        setSelected(Array.from(newSelected));
                    },
                }),
                createElement(
                    'figcaption',
                    null,
                    'List of available objects ',
                    createElement('a', {href: '#List'}, '[1]'),
                    '.',
                ),
            ),
            createElement('h1', null, `Light curves for the selected${selected.length === 1 ? '' : ` ${selected.length}`} object${selected.length === 1 ? '' : 's'}`),
            createElement(
                'ul',
                null,
                createElement('li', null, 'Drag horizontally to move the range.'),
                createElement('li', null, 'Drag vertically to change the scale.'),
                createElement('li', null, 'For a touch device, Pinch with 2 fingers to change the range.'),
                createElement(
                    'li',
                    null,
                    createElement(Preferences, {
                        preferences,
                        onChange: setPreferences,
                    }),
                ),
            ),
            createElement(
                'figure',
                null,
                createElement(LightCurve, {
                    preferences,
                    objects: selected,
                    objectMap,
                    cache: binnedLightCurveCache,
                }),
                createElement(
                    'figcaption',
                    null,
                    'Light curve for ',
                    ...selected.map((objectId, index) => createElement(
                        Fragment,
                        null,
                        `${index === 0 ? '' : ', '}${objectId} `,
                        createElement(
                            'a',
                            {href: `#Source-${objectId}`},
                            `[${selected.indexOf(objectId) + 2}]`,
                        ),
                    )),
                    '.',
                ),
            ),
            createElement('h1', null, 'References'),
            createElement(
                'ol',
                null,
                objectMap && createElement(
                    'li',
                    {id: 'List'},
                    `${objectMap.sourceTitle}, `,
                    createElement(
                        'a',
                        {href: objectMap.sourceURL, target: '_blank'},
                        objectMap.sourceURL,
                    ),
                ),
                ...selected.map((objectId) => {
                    const data = lightCurveCache.get(objectId);
                    return createElement(
                        'li',
                        {id: `Source-${objectId}`},
                        `${data ? data.sourceTitle : objectId}, `,
                        createElement(
                            'a',
                            {href: data && data.sourceURL, target: '_blank'},
                            data ? data.sourceURL : 'Loading...',
                        ),
                    );
                }),
            ),
            0 < errors.length && createElement(
                Fragment,
                null,
                createElement('h1', null, 'Errors'),
                ...errors.map((error) => [
                    createElement('h2', null, error.message),
                    createElement('pre', null, error.stack),
                ]),
            ),
        ),
    );
};
