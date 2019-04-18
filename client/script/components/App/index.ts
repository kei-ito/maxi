import {useState, createElement, useEffect, Fragment} from 'react';
import {MAXIObjectList} from '../MAXIObjectList/index';
import {getMAXIObjects} from '../../util/getMAXIObjects';
import {alertError} from '../../util/alertError';
import {IMAXIObject, Modes, IMAXILightCurveData, IError, IMAXIBinnedLightCurveData} from '../../types';
import {Preferences} from '../Preferences/index';
import {getItemsBetween} from '../../util/getItemsBetween';
import {LightCurve} from '../LightCurve/index';
import {getLightCurveData} from '../../util/getData';
import {getBinnedLightCurveData} from '../../util/getBinnedLightCurveData';
import {useCache} from '../../util/useCache';
import {ensureArray} from '../../util/ensureArray';
import {getDefaultPreferences} from '../../util/getDefaultPreferences';
import {URLParameterKey} from '../../util/constants';

export const App = () => {
    const [errors, setErrors] = useState<Array<IError | Error>>([]);
    const [preferences, setPreferences] = useState(getDefaultPreferences());
    const [objects, setObjects] = useState(new Map<string, IMAXIObject>());
    const [selected, setSelected] = useState<Array<string>>([]);
    const [lastSelection, setLastSelection] = useState<string | null>(null);
    const [loading, setLoading] = useState(-1);
    const lightCurveCache = useCache<IMAXILightCurveData>({
        keys: selected,
        getter: getLightCurveData,
        onError: (error) => {
            alertError(error);
            setErrors(errors.concat(error));
        },
    });
    const binnedLightCurveCache = useCache<IMAXIBinnedLightCurveData>({
        keys: selected,
        getter: (objectId) => {
            const rawData = lightCurveCache.get(objectId);
            if (rawData) {
                return getBinnedLightCurveData(rawData, preferences.binSize);
            }
            return null;
        },
        onError: (error) => {
            alertError(error);
            setErrors(errors.concat(error));
        },
        dependencies: [preferences.binSize, lightCurveCache],
    });

    useEffect(() => {
        if (loading === -1 && objects.size === 0) {
            setLoading(1);
            getMAXIObjects()
            .then((newObjects) => {
                const newMap = new Map(objects);
                for (const object of newObjects) {
                    newMap.set(object.id, object);
                }
                const urlParameters = new URLSearchParams(location.search);
                const requestedObjects = urlParameters.get(URLParameterKey.selected);
                if (requestedObjects) {
                    setSelected(
                        requestedObjects.trim().split(/\s*,\s*/)
                        .filter((objectId) => newMap.has(objectId)),
                    );
                }
                setObjects(newMap);
                setLoading(0);
            })
            .catch(alertError);
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
            createElement('h1', null, 'Object selector'),
            createElement(MAXIObjectList, {
                loading: loading !== 0,
                objects,
                selected,
                onSelect: (object, mode) => {
                    const newSelected = new Set(selected);
                    let targetObjects: Array<IMAXIObject> = [];
                    if (mode === Modes.Range && lastSelection) {
                        targetObjects = getItemsBetween(lastSelection, object.id, objects.values());
                    } else {
                        targetObjects = [object];
                        if (mode === Modes.Default) {
                            newSelected.clear();
                        }
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
                    setLastSelection(object.id);
                },
            }),
            createElement('h1', null, `Light curve of the selected${selected.length === 1 ? '' : ` ${selected.length}`} object${selected.length === 1 ? '' : 's'}`),
            ...(1 < selected.length ? [selected, ...selected] : selected)
            .map((object, index) => createElement(
                'figure',
                null,
                createElement(LightCurve, {
                    preferences,
                    object,
                    cache: binnedLightCurveCache,
                }),
                createElement(
                    'figcaption',
                    null,
                    `Fig.${index + 1} Light curve of ${ensureArray(object).join(', ')}. 1 bin = ${preferences.binSize} day${preferences.binSize === 1 ? '' : 's'}.`,
                ),
            )),
            createElement('h1', null, 'Preferences'),
            createElement(Preferences, {
                preferences,
                onChange: setPreferences,
            }),
            createElement('h1', null, 'References'),
            ...(
                errors.length === 0
                ? []
                : [createElement('h1', null, 'Errors')].concat(
                    ...errors.map((error) => [
                        createElement('h2', null, error.message),
                        createElement('pre', null, error.stack),
                    ]),
                )
            ),
        ),
    );
};
