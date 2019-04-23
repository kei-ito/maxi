import {createElement, HTMLProps} from 'react';
import classes from './style.css';
import {classnames} from '../../util/classnames';

export interface ILoadingProps {
    message: string,
    htmlProps?: HTMLProps<HTMLDivElement>,
}

export const Loading = (
    {
        message,
        htmlProps = {},
    }: ILoadingProps,
) => createElement(
    'div',
    {
        ...htmlProps,
        className: classnames(classes.container, htmlProps.className),
    },
    createElement(
        'svg',
        {
            className: classes.circle,
            viewBox: '-15 -15 30 30',
        },
        createElement(
            'path',
            {d: 'M10 0A10 10 0 0 1 0 10'},
        ),
    ),
    createElement(
        'div',
        {className: classes.message},
        message,
    ),
);
