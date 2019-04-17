import {createElement} from 'react';
import classes from './style.css';

export interface ILoadingProps {
    message: string,
}

export const Loading = (props: ILoadingProps) => {
    return createElement(
        'div',
        {className: classes.container},
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
            props.message,
        ),
    );
};
