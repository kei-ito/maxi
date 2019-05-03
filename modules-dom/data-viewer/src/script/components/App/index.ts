import {useState, createElement, useEffect, Fragment, useReducer, ChangeEvent} from 'react';
import {Mode, ILightCurveData, IError, IRollingAverageData, IPreferences} from '../../types';
import {getLightCurveData} from '../../util/getData';
import {getRollingAverage} from '../../util/getRollingAverage';
import {useCache} from '../../util/useCache';
import {getDefaultPreferences, filterBinSize, filterMJDRange, filterPlotType} from '../../util/getDefaultPreferences';
import {URLParameterKey, AvailablePlotTypes, pageTitle} from '../../util/constants';
import {ObjectList} from '../ObjectList/index';
import {LightCurve} from '../LightCurve/index';
import {SearchForm} from '../SearchForm/index';
import {normalizeSearchText} from '../../util/normalizeSearchText';
import * as catalog from '../../util/catalog';
import classes from './style.css';

export const getInitialSelectedObjects = (): Array<string> => {
    const matched = location.pathname.match(/^\/objects\/([^/]+)$/);
    let list: Array<string> = [];
    if (matched) {
        list = matched[1].split(/\s*,\s*/).filter((id) => catalog.map.has(id));
    }
    if (list.length === 0) {
        list.push(catalog.firstObjectId);
    }
    return list;
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
    const [searchWords, setSearchWords] = useState('');
    const [selected, setSelected] = useState<Array<string>>(getInitialSelectedObjects());
    const [currentURL, setURLParameters] = useReducer(
        (
            currentURL: URL,
            urlParameters: URLSearchParams,
        ): URL => new URL(
            `objects/${selected.join(',')}?${urlParameters}`,
            `${currentURL.protocol}//${currentURL.host}`,
        ),
        new URL(location.href),
    );
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
        const urlParameters = new URLSearchParams();
        urlParameters.set(URLParameterKey.mjdRange, preferences.mjdRange.map((mjd) => mjd.toFixed(0)).join('-'));
        urlParameters.set(URLParameterKey.binSize, `${preferences.binSize}`);
        urlParameters.set(URLParameterKey.plotType, `${preferences.plotType}`);
        setURLParameters(urlParameters);
    }, [selected, preferences]);

    useEffect(() => history.replaceState(null, '', `${currentURL}`), [currentURL]);
    useEffect(() => {
        document.title = `${selected.join(', ')} | ${pageTitle}`;
    }, [selected]);

    return createElement(
        Fragment,
        null,
        createElement('header', null, createElement('h1', null, pageTitle)),
        createElement(
            'article',
            null,
            createElement('h1', null, [
                'Object selector',
                `(${catalog.map.size} object${catalog.map.size === 0 ? '' : 's'})`,
            ].join(' ')),
            createElement(
                'figure',
                null,
                createElement(
                    SearchForm,
                    {
                        label: 'Search for:',
                        placeholder: 'All (Click here to set words)',
                        defaultValue: '',
                        onChange: (words) => setSearchWords(normalizeSearchText(words)),
                    },
                ),
                createElement(ObjectList, {
                    searchWords,
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
            createElement('h1', null, 'Tips'),
            createElement(
                'ol',
                null,
                createElement('li', null, 'To move the range, drag horizontally or scroll while holding Shift key.'),
                createElement('li', null, 'To change the scale, drag vertically or scroll while holding Ctrl key.'),
                createElement('li', null, 'For a touch device, Pinch with 2 fingers to change the range.'),
                createElement(
                    'li',
                    null,
                    'The URL ',
                    createElement('a', {href: `${currentURL}`}, `${currentURL}`),
                    ' contains the current state of this app. You can share it to others and reproduce what you see now on their devices.',
                ),
            ),
            createElement('h1', null, 'References'),
            createElement(
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
