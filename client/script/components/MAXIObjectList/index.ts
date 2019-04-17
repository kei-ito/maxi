import {createElement, useState, PointerEvent, KeyboardEvent} from 'react';
import {IMAXIObject, Modes} from '../../types';
import {classnames} from '../../util/classnames';
import {iterate} from '../../util/iterate';
import {Loading} from '../Loading/index';
import classes from './style.css';

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
    {
        key,
        className: classes.thr,
    },
    ...['ID', 'Name', 'RA', 'Dec', 'L', 'B', 'Category']
    .map((label) => createElement(
        'th',
        {className: classnames(classes.cell, classes.th)},
        label,
    )),
);

export const getModeFromEvent = (
    event: PointerEvent | KeyboardEvent,
): Modes => {
    if (event.shiftKey) {
        return Modes.Range;
    }
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
                className: classnames(
                    classes.tr,
                    isSelected && classes.selected,
                ),
                key: rows.length,
                tabIndex: 100 + index,
                onClick: (event: PointerEvent<HTMLTableRowElement>) => {
                    event.preventDefault();
                    props.onSelect(object, getModeFromEvent(event));
                },
                onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
                    if (event.key === 'Enter') {
                        props.onSelect(object, getModeFromEvent(event));
                    }
                },
            },
            createElement('td', {className: classnames(classes.cell,  classes.id)}, object.id),
            createElement(
                'td',
                {className: classnames(classes.cell, classes.name)},
                object.name,
            ),
            createElement('td', {className: classnames(classes.cell, classes.number)}, object.RA.toFixed(3)),
            createElement('td', {className: classnames(classes.cell, classes.number)}, object.Dec.toFixed(3)),
            createElement('td', {className: classnames(classes.cell, classes.number)}, object.L.toFixed(3)),
            createElement('td', {className: classnames(classes.cell, classes.number)}, object.B.toFixed(3)),
            createElement('td', {className: classnames(classes.cell)}, object.category),
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
                        setSearchKeywords(event.currentTarget.value.toLowerCase());
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
                {className: classes.table},
                createElement('tbody', {children: rows}),
            ),
        ),
    );
};
