import {useState, createElement, useEffect} from 'react';
import {MAXIObjectList} from '../MAXIObjectList/index';
import {getMAXIObjects} from '../../util/getMAXIObjects';
import {alertError} from '../../util/alertError';
import {IMAXIObject, getDefaultPreferences, Modes} from '../../types';
import classes from './style.css';
import {Preferences} from '../Preferences/index';
import {classnames} from '../../util/classnames';
import {getItemsBetween} from '../../util/getItemsBetween';
import {LightCurve} from '../LightCurve/index';

export const App = () => {
    const [preferences, setPreferences] = useState(getDefaultPreferences());
    const [objects, setObjects] = useState(new Map<string, IMAXIObject>());
    const [selected, setSelected] = useState<Array<string>>([]);
    const [lastSelection, setLastSelection] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!loading && objects.size === 0) {
            setLoading(true);
            getMAXIObjects()
            .then((newObjects) => {
                const newMap = new Map(objects);
                for (const object of newObjects) {
                    newMap.set(object.id, object);
                }
                setObjects(newMap);
                setLoading(false);
            })
            .catch(alertError);
        }
    });
    return createElement(
        'div',
        {
            className: classnames(
                classes.container,
                classes[preferences.font],
            ),
        },
        MAXIObjectList({
            loading,
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
        LightCurve({
            selected,
            binSize: 1,
        }),
        Preferences({
            preferences,
            onChange: (newPreferences) => {
                setPreferences(newPreferences);
            },
        }),
    );
};
