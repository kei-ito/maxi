import {memo, createElement} from 'react';
import {getTicks} from '../../util/getTicks';
import {Color, IRect} from '../../types';
import {mainTickSize, subTickSize} from '../../util/constants';
import {getDateTicks} from '../../util/getDateTicks';
import {mjdToDate, dateToMJD} from '../../util/mjd';

export interface IXTicksProps extends IRect {
    min: number,
    max: number,
    mjdLabel: boolean,
    dateLabel: boolean,
    mjdToString?: (value: number) => string,
    dateToString?: (value: number) => string,
}

const createPositionFixer = (
    x: number,
    left: number,
    right: number,
    isFirst: boolean,
    isLast: boolean,
) => {
    if (!isFirst && !isLast) {
        return null;
    }
    return (labelElement: SVGTextElement | null) => {
        if (labelElement) {
            const parentElement = labelElement.parentElement;
            if (parentElement) {
                const haldWidth = labelElement.getBoundingClientRect().width * 0.5;
                if (isFirst) {
                    const overflow = left - (x - haldWidth);
                    if (0 < overflow) {
                        labelElement.setAttribute('x', `${x + overflow}`);
                    }
                }
                if (isLast) {
                    const overflow = (x + haldWidth) - right;
                    if (0 < overflow) {
                        labelElement.setAttribute('x', `${x - overflow}`);
                    }
                }

            }
        }
    };
};

export const XTicks = memo((
    {
        min,
        max,
        left,
        right,
        top,
        bottom,
        width,
        mjdLabel,
        dateLabel,
        mjdToString,
        dateToString,
    }: IXTicksProps,
) => {
    const mjdTicks = getTicks(min, max, width / 200);
    const dateTicks = getDateTicks(mjdToDate(min), mjdToDate(max), width / 200);
    if (!mjdTicks || !dateTicks) {
        return null;
    }
    const margin = 4;
    const lineHeight = 16;
    const range = max - min;
    const scale = width / range;
    const X = (value: number) => left + scale * (value - min);
    const children = [
        createElement(
            'path',
            {
                key: 'ticks',
                d: [
                    (dateTicks.sub.map((date, index) => {
                        const isMainTick = (index - dateTicks.stepOffset) % dateTicks.step === 0;
                        return `M${X(dateToMJD(date))},${top}v${isMainTick ? mainTickSize : subTickSize}`;
                    }).join('')),
                    (mjdTicks.sub.map((mjd, index) => {
                        const isMainTick = (index - mjdTicks.stepOffset) % mjdTicks.step === 0;
                        return `M${X(mjd)},${bottom}v${-(isMainTick ? mainTickSize : subTickSize)}`;
                    }).join('')),
                ].join(''),
                stroke: Color.black,
            },
        ),
    ];
    if (dateLabel) {
        const lastIndex = dateTicks.main.length - 1;
        dateTicks.main.forEach((value, index) => {
            const x = X(dateToMJD(value));
            children.push(createElement(
                'text',
                {
                    key: `dateLabel-${index}`,
                    x,
                    y: top - margin,
                    fill: Color.black,
                    dominantBaseline: 'baseline',
                    textAnchor: 'middle',
                    ref: createPositionFixer(x, left, right, index === 0, index === lastIndex),
                },
                (dateToString || dateTicks.toString)(value),
            ));
        });
        children.push(createElement(
            'text',
            {
                key: 'dateLabel',
                x: X(max),
                y: top - margin - lineHeight,
                fill: Color.black,
                dominantBaseline: 'baseline',
                textAnchor: 'end',
            },
            'UTC',
        ));
    }
    if (mjdLabel) {
        const lastIndex = mjdTicks.main.length - 1;
        mjdTicks.main.forEach((value, index) => {
            const x = X(value);
            children.push(createElement(
                'text',
                {
                    key: `mjdLabel-${index}`,
                    x,
                    y: bottom + margin,
                    fill: Color.black,
                    dominantBaseline: 'hanging',
                    textAnchor: 'middle',
                    ref: createPositionFixer(x, left, right, index === 0, index === lastIndex),
                },
                (mjdToString || mjdTicks.toString)(value),
            ));
        });
        children.push(createElement(
            'text',
            {
                key: 'mjdLabel',
                x: X(max),
                y: bottom + margin + lineHeight,
                fill: Color.black,
                dominantBaseline: 'hanging',
                textAnchor: 'end',
            },
            'MJD',
        ));
    }
    return createElement('g', {children});
});
