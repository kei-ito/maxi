import {createElement, HTMLAttributes} from 'react';
import classes from './style.css';

interface ISearchFormProps {
    label: string,
    placeholder: string,
    defaultValue: string,
    onChange: (words: string) => void,
}

interface ISearchElement extends HTMLFormElement {
    words: HTMLInputElement,
}

interface ISearchElementProps extends HTMLAttributes<ISearchElement> {}

export const SearchForm = (
    props: ISearchFormProps,
) => createElement<ISearchElementProps, ISearchElement>(
    'form',
    {
        className: classes.form,
        onChange: (event) => {
            props.onChange(event.currentTarget.words.value);
        },
    },
    createElement(
        'label',
        {htmlFor: classes.input},
        props.label,
    ),
    createElement(
        'input',
        {
            id: classes.input,
            type: 'text',
            name: 'words',
            placeholder: props.placeholder,
            spellCheck: false,
            defaultValue: props.defaultValue,
        },
    ),
);
