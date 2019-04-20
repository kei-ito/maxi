import {useState, createElement, useEffect, Fragment} from 'react';
import {getObjectMap} from '../../util/getObjectMap';
import {Modes, ILightCurveData, IError, IBinnedLightCurveData, IObjectMap} from '../../types';
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
import {isString} from '../../util/isString';

export const App = () => {
    const [errors, setErrors] = useState<Array<IError | Error>>([]);
    const [preferences, setPreferences] = useState(getDefaultPreferences());
    const [objectMap, setObjectMap] = useState<IObjectMap | null>(null);
    const [searchWords, setSearchWords] = useState('');
    const [selected, setSelected] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(-1);
    const onError = (error: Error) => {
        setErrors(errors.concat(error));
    };
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
            urlParameters.set(URLParameterKey.scale, preferences.scale.toFixed(4));
            urlParameters.set(URLParameterKey.font, preferences.font);
            const url = new URL(location.href);
            url.search = `${urlParameters}`;
            history.replaceState(null, selectedObjectsCSV, `${url}`);
        }
    }, [selected, preferences, loading]);

    const plots: Array<Array<string | null>> = [selected];

    if (1 < selected.length) {
        selected.forEach((_, index1) => {
            plots.push(selected.map((objectId, index2) => index1 === index2 ? objectId : null));
        });
    }

    return createElement(
        Fragment,
        null,
        createElement(
            'header',
            null,
            createElement('h1', null, 'MAXI GSC Data Viewer'),
        ),
        createElement(
            'article',
            null,
            createElement('h1', null, [
                'Object selector',
                objectMap
                ? `(${objectMap.size} object${objectMap.size === 0 ? '' : 's'})`
                : '(Loading...)',
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
                        onChange: (words) => {
                            setSearchWords(normalizeSearchText(words));
                        },
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
                        if (mode !== Modes.Append) {
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
                        setSelected(Array.from(newSelected).slice(-9));
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
            ...plots.map((objects) => createElement(
                'figure',
                null,
                createElement(LightCurve, {
                    preferences,
                    objects,
                    cache: binnedLightCurveCache,
                }),
                createElement(
                    'figcaption',
                    null,
                    'Light curve for ',
                    ...objects
                    .filter(isString)
                    .map((objectId, index) => createElement(
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
            )),
            createElement('h1', null, 'Preferences'),
            createElement(Preferences, {
                preferences,
                onChange: setPreferences,
            }),
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
                        {
                            href: objectMap.sourceURL,
                            target: '_blank',
                        },
                        objectMap.sourceURL,
                    ),
                ),
                ...selected.map((objectId) => {
                    const data = lightCurveCache.get(objectId);
                    if (!data) {
                        return null;
                    }
                    return createElement(
                        'li',
                        {id: `Source-${objectId}`},
                        `${data.sourceTitle}, `,
                        createElement(
                            'a',
                            {
                                href: data.sourceURL,
                                target: '_blank',
                            },
                            data.sourceURL,
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
