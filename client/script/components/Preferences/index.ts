import {createElement, FormEvent} from 'react';
import {IPreferences, IFont, AvailableFonts} from '../../types';

export interface IPreferencesProps {
    preferences: IPreferences,
    onChange: (newPreferences: IPreferences) => void,
}

export interface IPreferencesFormElement extends HTMLFormElement {
    font: HTMLInputElement,
}

export const Preferences = (
    props: IPreferencesProps,
) => createElement(
    'form',
    {
        onChange: (event: FormEvent<IPreferencesFormElement>) => {
            const formElement = event.currentTarget;
            props.onChange({
                font: formElement.font.value as IFont,
            });
        },
    },
    createElement('h1', null, 'Preferences'),
    createElement('h2', null, 'Fonts'),
    ...AvailableFonts.map((font) => createElement(
        'input',
        {
            type: 'radio',
            name: 'font',
            value: font,
            defaultChecked: props.preferences.font === font,
        },
    )),
);
