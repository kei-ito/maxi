import {createElement, memo} from 'react';
import {getTicks} from '../../util/getTicks';
import {Color, IRect} from '../../types';
import {mainTickSize, subTickSize} from '../../util/constants';

export interface IYTicksProps extends IRect {
    min: number,
    max: number,
}

export const YTicks = memo((
    {
        min,
        max,
        left,
        bottom,
        height,
    }: IYTicksProps,
) => {
    const ticks = getTicks(min, max, height / 100);
    if (!ticks) {
        return null;
    }
    const range = max - min;
    const scale = height / range;
    const Y = (value: number) => bottom - scale * (value - min);
    const digits = Math.max(Math.ceil(1 - Math.log10(range)), 0);
    const children = [
        createElement(
            'path',
            {
                key: 'ticks',
                d: ticks.sub
                .map((value, index) => `M${left},${Y(value)}h${(index - ticks.stepOffset) % ticks.step === 0 ? mainTickSize : subTickSize}`)
                .join(''),
                stroke: Color.black,
            },
        ),
    ];
    ticks.main.forEach((value, index) => {
        children.push(createElement(
            'text',
            {
                key: `yLabel-${index}`,
                x: left - 4,
                y: Y(value),
                fill: Color.black,
                dominantBaseline: 'middle',
                textAnchor: 'end',
            },
            value.toFixed(digits),
        ));
    });
    return createElement('g', {children});
});
