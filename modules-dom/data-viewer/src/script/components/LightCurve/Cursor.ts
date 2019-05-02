import {createElement, memo} from 'react';
import {mjdToDate} from '../../util/mjd';
import {Color} from '../../types';

export interface ICursorProps {
    cursor: {
        x: number,
        y: number,
    } | null,
    svgHeight: number,
    left: number,
    areaWidth: number,
    minMJD: number,
    maxMJD: number,
}

export const Cursor = memo((
    {
        cursor,
        svgHeight,
        left,
        areaWidth,
        minMJD,
        maxMJD,
    }: ICursorProps,
) => {
    if (!cursor) {
        return null;
    }
    const range = maxMJD - minMJD;
    const xToMJD = (x: number) => minMJD + x / areaWidth * range;
    return createElement(
        'g',
        null,
        createElement(
            'path',
            {
                d: `M${left + cursor.x},1V${svgHeight - 1}`,
                stroke: Color.black,
                opacity: 0.3,
            },
        ),
        createElement(
            'text',
            {
                x: left + cursor.x + 2,
                y: cursor.y - 12,
                fontSize: '80%',
                fill: Color.black,
                opacity: 0.7,
            },
            `${xToMJD(cursor.x).toFixed(0)}MJD`,
        ),
        createElement(
            'text',
            {
                x: left + cursor.x + 2,
                y: cursor.y - 2,
                fontSize: '80%',
                fill: Color.black,
                opacity: 0.7,
            },
            `${mjdToDate(xToMJD(cursor.x)).toISOString().split('T')[0]}`,
        ),
    );
});
