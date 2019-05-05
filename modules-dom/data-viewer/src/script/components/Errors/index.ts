import {createElement, memo, Fragment} from 'react';
import {IError} from '../../types';

export interface IErrorsProps {
    errors: Array<IError | Error>,
}

export const Errors = memo((
    {errors}: IErrorsProps,
) => {
    if (0 < errors.length) {
        return createElement(
            Fragment,
            null,
            createElement('h1', null, 'Errors'),
            createElement(
                'ol',
                null,
                ...errors.map((error) => createElement(
                    'li',
                    null,
                    error.message,
                    createElement('pre', null, error.stack),
                )),
            ),
        );
    }
    return null;
});
