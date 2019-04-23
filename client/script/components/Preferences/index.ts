import {createElement, useState, useEffect, HTMLAttributes} from 'react';
import {IPreferences} from '../../types';
import {filterBinSize} from '../../util/getDefaultPreferences';
import classes from './style.css';

interface IPreferencesProps {
    preferences: IPreferences,
    onChange: (newPreferences: IPreferences) => void,
}

interface IPreferencesFormElement extends HTMLFormElement {
    binSize: HTMLInputElement,
}

interface IPreferencesFormElementProps extends HTMLAttributes<IPreferencesFormElement> {}

export const Preferences = (
    props: IPreferencesProps,
) => {
    const [preferences, setPreferences] = useState(props.preferences);
    useEffect(() => {
        const timer = setTimeout(() => {
            props.onChange(preferences);
        }, 300);
        return () => clearTimeout(timer);
    }, [preferences]);
    return createElement<IPreferencesFormElementProps, IPreferencesFormElement>(
        'form',
        {
            className: classes.form,
            onChange: (event) => {
                const formElement = event.currentTarget;
                const binSize = filterBinSize(formElement.binSize.value);
                formElement.binSize.value = `${binSize}`;
                setPreferences({
                    binSize,
                });
            },
        },
        createElement('label', {htmlFor: 'binSize'}, 'Bin size: '),
        createElement(
            'input',
            {
                id: 'binSize',
                type: 'number',
                name: 'binSize',
                min: 1,
                max: 100,
                defaultValue: preferences.binSize,
            },
        ),
        `day${preferences.binSize === 1 ? '' : 's'}.`,
    );
};
