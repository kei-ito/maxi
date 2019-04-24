import {useState, createElement, useEffect, Fragment, useReducer, ChangeEvent} from 'react';
import {getObjectMap} from '../../util/getObjectMap';
import {Mode, ILightCurveData, IError, IObjectMap, IRollingAverageData, IPreferences} from '../../types';
import {getLightCurveData} from '../../util/getData';
import {getRollingAverage} from '../../util/getRollingAverage';
import {useCache} from '../../util/useCache';
import {getDefaultPreferences, filterBinSize, filterMJDRange, filterPlotType} from '../../util/getDefaultPreferences';
import {URLParameterKey, AvailablePlotTypes} from '../../util/constants';
import {ObjectList} from '../ObjectList/index';
import {LightCurve} from '../LightCurve/index';
import {SearchForm} from '../SearchForm/index';
import {normalizeSearchText} from '../../util/normalizeSearchText';
import classes from './style.css';

export const getInitialSelectedObjects = (): Array<string> => {
    const urlParameters = new URLSearchParams(location.search);
    const parameter = urlParameters.get(URLParameterKey.selected);
    return parameter ? parameter.trim().split(/\s*,\s*/) : [];
};

export const App = () => {
    const [errors, onError] = useReducer(
        (
            errors: Array<IError | Error>,
            newError: IError | Error,
        ) => errors.concat(newError),
        [],
    );
    const [preferences, __setPreferences] = useReducer(
        (
            currentPreferences: IPreferences,
            nextPreferences: Partial<IPreferences>,
        ): IPreferences => ({
            binSize: filterBinSize(nextPreferences.binSize || currentPreferences.binSize),
            mjdRange: filterMJDRange(nextPreferences.mjdRange || currentPreferences.mjdRange),
            plotType: filterPlotType(nextPreferences.plotType || currentPreferences.plotType),
        }),
        getDefaultPreferences(new URLSearchParams(location.search)),
    );
    const [preferencesBuffer, requestPreferenceUpdate] = useReducer(
        (
            currentPreferencesBuffer: Partial<IPreferences>,
            updates: Partial<IPreferences>,
        ): Partial<IPreferences> => ({
            binSize: updates.binSize || currentPreferencesBuffer.binSize,
            mjdRange: updates.mjdRange || currentPreferencesBuffer.mjdRange,
            plotType: updates.plotType || currentPreferencesBuffer.plotType,
        }),
        getDefaultPreferences(new URLSearchParams(location.search)),
    );
    const [objectMap, setObjectMap] = useState<IObjectMap | null>(null);
    const [searchWords, setSearchWords] = useState('');
    const [selected, setSelected] = useState<Array<string>>(getInitialSelectedObjects());
    const [loading, setLoading] = useState(-1);
    const lightCurveCache = useCache<ILightCurveData>({
        keys: selected,
        getter: getLightCurveData,
        onError,
    });
    const rollingAverageCache = useCache<IRollingAverageData>({
        keys: selected,
        getter: (objectId) => {
            const rawData = lightCurveCache.get(objectId);
            if (rawData) {
                return getRollingAverage(rawData, preferences.binSize);
            }
            return null;
        },
        onError,
        dependencies: [preferences.binSize, lightCurveCache],
    });

    useEffect(() => {
        const timerId = setTimeout(() => __setPreferences(preferencesBuffer), 300);
        return () => clearTimeout(timerId);
    }, [preferencesBuffer]);

    useEffect(() => {
        if (loading === -1 && !objectMap) {
            setLoading(1);
            getObjectMap()
            .then((newObjectMap) => {
                const newSelected = selected.filter((objectId) => newObjectMap.has(objectId));
                if (newSelected.length === 0) {
                    const firstIteratorResult = newObjectMap.keys().next();
                    if (!firstIteratorResult.done) {
                        newSelected.push(firstIteratorResult.value);
                    }
                }
                setSelected(newSelected);
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
            urlParameters.set(URLParameterKey.mjdRange, preferences.mjdRange.map((mjd) => mjd.toFixed(0)).join('-'));
            urlParameters.set(URLParameterKey.binSize, `${preferences.binSize}`);
            urlParameters.set(URLParameterKey.plotType, `${preferences.plotType}`);
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
                    createElement('label', {htmlFor: URLParameterKey.binSize}, 'Bin size: '),
                    createElement(
                        'input',
                        {
                            id: URLParameterKey.binSize,
                            type: 'number',
                            min: 1,
                            max: 100,
                            defaultValue: preferences.binSize,
                            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                                requestPreferenceUpdate({binSize: filterBinSize(event.currentTarget.value)});
                            },
                        },
                    ),
                    `day${preferences.binSize === 1 ? '' : 's'}.`,
                ),
                createElement(
                    'li',
                    null,
                    createElement('label', null, 'Plot type: '),
                    ...AvailablePlotTypes.map((plotType) => createElement(
                        'label',
                        {className: classes.radioLabel},
                        createElement(
                            'input',
                            {
                                type: 'radio',
                                name: URLParameterKey.plotType,
                                value: plotType,
                                defaultChecked: preferences.plotType === plotType,
                                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                                    requestPreferenceUpdate({plotType: filterPlotType(event.currentTarget.value)});
                                },
                            },
                        ),
                        plotType,
                    )),
                    '.',
                ),
            ),
            createElement(
                'figure',
                null,
                createElement(LightCurve, {
                    preferences,
                    objects: 0 < selected.length ? selected : [''],
                    objectMap,
                    cache: rollingAverageCache,
                    setPreferences: __setPreferences,
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
                    `${objectMap.sourceTitle}. Retrieved ${objectMap.createdAt.toLocaleString()}. `,
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
