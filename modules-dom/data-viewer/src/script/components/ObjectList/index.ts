import {createElement, PointerEvent, KeyboardEvent, useRef, useState} from 'react';
import {IObjectData} from '@maxi-js/catalog';
import {Mode} from '../../types';
import classes from './style.css';
import * as catalog from '../../util/catalog';

export interface IObjectListProps {
    selected: Array<string>,
    searchWords: string,
    onSelect: (
        object: IObjectData,
        mode: Mode,
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
): Mode => {
    if (event.shiftKey) {
        return Mode.Range;
    }
    if (event.metaKey || event.ctrlKey) {
        return Mode.Append;
    }
    return Mode.Default;
};

export const ObjectList = (
    props: IObjectListProps,
) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [initialSelected, setInitialSelected] = useState<string | null>(null);
    const rows = [createHeading(0)];
    let selectedObjectIsFound = false;
    catalog.map.forEach((object) => {
        const isSelected = props.selected.includes(object.id);
        if (!object.hash.includes(props.searchWords)) {
            return;
        }
        rows.push(createElement(
            'tr',
            {
                'key': rows.length,
                'tabIndex': 100 + rows.length,
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
                'ref': selectedObjectIsFound || initialSelected || !isSelected ? null : (trElement) => {
                    const containerElement = containerRef.current;
                    if (containerElement && trElement) {
                        const containerRect = containerElement.getBoundingClientRect();
                        const trTop = trElement.getBoundingClientRect().top;
                        const diff = trTop - (containerRect.top + containerRect.height * 0.3);
                        containerElement.scrollTop = diff;
                        setInitialSelected(object.id);

                    }
                },
            },
            createElement('td', {className: classes.id}, object.id),
            createElement(
                'td',
                {className: classes.name},
                object.name,
            ),
            createElement('td', {className: classes.number}, object.ra.toFixed(3)),
            createElement('td', {className: classes.number}, object.dec.toFixed(3)),
            createElement('td', {className: classes.number}, object.l.toFixed(3)),
            createElement('td', {className: classes.number}, object.b.toFixed(3)),
            createElement('td', null, object.category),
        ));
        selectedObjectIsFound = selectedObjectIsFound || isSelected;
    });
    return createElement(
        'div',
        {
            className: classes.container,
            ref: containerRef,
        },
        createElement(
            'table',
            null,
            createElement('tbody', {children: rows}),
        ),
    );
};
