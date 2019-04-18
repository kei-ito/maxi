import {createElement, useState, PointerEvent, KeyboardEvent} from 'react';
import {IMAXIObject, Modes} from '../../types';
import {classnames} from '../../util/classnames';
import {iterate} from '../../util/iterate';
import {Loading} from '../Loading/index';
import classes from './style.css';
import {normalizeSearchText} from '../../util/normalizeSearchText';

export interface IMAXIObjectListProps {
    loading: boolean,
    objects: Map<string, IMAXIObject>,
    selected: Array<string>,
    onSelect: (
        object: IMAXIObject,
        mode: Modes,
    ) => void,
}

export const createHeading = (
    key: number,
) => createElement(
    'tr',
    {key},
    ...['ID', 'Name', 'RA', 'Dec', 'L', 'B', 'Category']
    .map((label) => createElement(
        'th',
        null,
        label,
    )),
);

export const getModeFromEvent = (
    event: PointerEvent | KeyboardEvent,
): Modes => {
    // if (event.shiftKey) {
    //     return Modes.Range;
    // }
    if (event.metaKey || event.ctrlKey) {
        return Modes.Append;
    }
    return Modes.Default;
};

export const MAXIObjectList = (
    props: IMAXIObjectListProps,
) => {
    const [searchKeywords, setSearchKeywords] = useState('');
    const rows = [createHeading(0)];
    iterate(props.objects.values(), (object, index) => {
        const isSelected = props.selected.includes(object.id);
        if (!object.hash.includes(searchKeywords)) {
            return;
        }
        rows.push(createElement(
            'tr',
            {
                'key': rows.length,
                'tabIndex': 100 + index,
                'onClick': (event: PointerEvent<HTMLTableRowElement>) => {
                    event.preventDefault();
                    props.onSelect(object, getModeFromEvent(event));
                },
                'onKeyDown': (event: KeyboardEvent<HTMLTableRowElement>) => {
                    if (event.key === 'Enter') {
                        props.onSelect(object, getModeFromEvent(event));
                    }
                },
                'data-selected': isSelected ? '' : null,
            },
            createElement('td', {className: classes.id}, object.id),
            createElement(
                'td',
                {className: classes.name},
                object.name,
            ),
            createElement('td', {className: classes.number}, object.RA.toFixed(3)),
            createElement('td', {className: classes.number}, object.Dec.toFixed(3)),
            createElement('td', {className: classes.number}, object.L.toFixed(3)),
            createElement('td', {className: classes.number}, object.B.toFixed(3)),
            createElement('td', null, object.category),
        ));
    });
    return createElement(
        'div',
        {className: classes.container},
        createElement(
            'div',
            {className: classes.filterWrapper},
            'Search:',
            createElement(
                'input',
                {
                    className: classnames(
                        classes.filterInput,
                        !searchKeywords && classes.empty,
                    ),
                    placeholder: 'Type keywords here.',
                    type: 'text',
                    defaultValue: searchKeywords,
                    onChange: (event) => {
                        const newSearchKeywords = normalizeSearchText(event.currentTarget.value);
                        setSearchKeywords(newSearchKeywords);
                    },
                },
            ),
        ),
        createElement(
            'div',
            {className: classes.tableWrap},
            props.loading && Loading({message: 'Loading objects...'}),
            createElement(
                'table',
                null,
                createElement('tbody', {children: rows}),
            ),
        ),
    );
};
