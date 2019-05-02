import {createElement, ReactElement, memo} from 'react';
import {Band, BandTitles, PlotType, IRollingAverageBin, BandColors, Color, IRect, IObject, IRollingAverageData} from '../../types';
import {mainTickSize} from '../../util/constants';
import {YTicks} from './YTicks';
import {XTicks} from './XTicks';

export interface IAreaProps extends IRect {
    band: Band,
    minMJD: number,
    maxMJD: number,
    binSize: number,
    object: IObject | null | undefined,
    data: IRollingAverageData | null | undefined,
    plotType: PlotType,
    isFirst: boolean,
    isLast: boolean,
}

export const Area = memo((
    {
        band,
        left,
        right,
        top,
        bottom,
        width,
        height,
        minMJD,
        maxMJD,
        binSize,
        object,
        data,
        plotType,
        isFirst,
        isLast,
    }: IAreaProps,
) => {
    const bandTitle = BandTitles[band];
    const bandColor = BandColors[band];
    const centerY = (top + bottom) * 0.5;
    const elements: Array<ReactElement> = [
        createElement(
            'text',
            {
                key: 'yTitle',
                x: 2,
                y: centerY,
                transform: `rotate(-90, 3,${centerY})`,
                fill: Color.black,
                dominantBaseline: 'hanging',
                textAnchor: 'middle',
            },
            'Count cm\u207B\u00B2 s\u207B\u00B9',
        ),
        createElement(
            'rect',
            {
                key: 'frame',
                x: left,
                y: top,
                width: width,
                height: height,
                stroke: Color.black,
            },
        ),
        createElement(XTicks, {
            key: 'xTicks',
            min: minMJD,
            max: maxMJD,
            left,
            right,
            top,
            bottom,
            width,
            height,
            mjdLabel: isLast,
            dateLabel: isFirst,
        }),
    ];
    elements.push(createElement(
        'text',
        {
            key: 'subTitle',
            x: left + mainTickSize + 4,
            y: top + mainTickSize + 20,
            fill: Color.black,
            dominantBaseline: 'hanging',
            textAnchor: 'start',
        },
        `bin size: ${binSize} day${binSize === 1 ? '' : 's'}`,
    ));
    if (object) {
        elements.push(createElement(
            'text',
            {
                key: 'title',
                x: left + mainTickSize + 4,
                y: top + mainTickSize + 3,
                fill: Color.black,
                dominantBaseline: 'hanging',
                textAnchor: 'start',
            },
            `${object.name} (${object.id}) ${bandTitle}`,
        ));
    }
    if (data) {
        const rangeX = maxMJD - minMJD;
        const scaleX = width / rangeX;
        const X = (mjd: number) => left + scaleX * (mjd - minMJD);
        const minY = data.minY[band];
        const maxY = data.maxY[band];
        const rangeY = maxY - minY;
        const scaleY = height / rangeY;
        const Y = (flux: number) => bottom - scaleY * (flux - minY);
        const isInViewBox = (x: number) => left <= x && x <= right;
        const fluxIndex = band * 2 + 3;
        const errorIndex = fluxIndex + 1;
        elements.push(
            createElement(YTicks, {
                key: 'yTicks',
                min: minY,
                max: maxY,
                left,
                right,
                top,
                bottom,
                width,
                height,
            }),
        );
        if (plotType === PlotType.Line) {
            let previousBinEndMJD = -1;
            let bins: Array<IRollingAverageBin> = [];
            const errorD: Array<string> = [];
            const flushErrorPath = () => {
                if (0 < bins.length) {
                    errorD.push([
                        `M${bins.map((bin) => `${X(bin[0])},${Y(bin[fluxIndex] + bin[errorIndex])}`).join('L')}`,
                        `L${bins.reverse().map((bin) => `${X(bin[0])},${Y(bin[fluxIndex] - bin[errorIndex])}`).join('L')}z`,
                        'z',
                    ].join(''));
                }
                bins = [];
            };
            const rollingAverageD = data.bins.map((bin) => {
                const x = X(bin[0]);
                previousBinEndMJD = bin[2];
                if (isInViewBox(x)) {
                    const y = Y(bin[fluxIndex]);
                    const jump = previousBinEndMJD < bin[1];
                    if (jump) {
                        flushErrorPath();
                        bins.push(bin);
                        return `M${x},${y}`;
                    } else {
                        bins.push(bin);
                        return `L${x},${y}`;
                    }
                }
                return '';
            }).join('');
            flushErrorPath();
            if (rollingAverageD) {
                elements.push(
                    createElement(
                        'path',
                        {
                            key: `${PlotType.Line}-error`,
                            d: errorD.join(''),
                            fill: bandColor,
                            opacity: 0.2,
                        },
                    ),
                    createElement(
                        'path',
                        {
                            key: PlotType.Line,
                            d: `M${rollingAverageD.slice(1)}`,
                            stroke: bandColor,
                        },
                    ),
                );
            }
        } else {
            let previousBinEndMJD = -1;
            elements.push(
                createElement(
                    'path',
                    {
                        key: PlotType.Point,
                        d: data.bins.map((bin) => {
                            if (bin[1] < previousBinEndMJD) {
                                return '';
                            }
                            previousBinEndMJD = bin[2];
                            const x = X(bin[0]);
                            const xL = X(bin[1]);
                            const xR = X(bin[2]);
                            const y = Y(bin[fluxIndex]);
                            const e = bin[errorIndex] * scaleY;
                            const fragments: Array<string> = [];
                            if (left < xR && xL < right) {
                                fragments.push(`M${Math.max(left, xL)},${y}H${Math.min(right, xR)}`);
                                if (isInViewBox(x)) {
                                    fragments.push(`M${x},${y - e}v${2 * e}`);
                                }
                            }
                            return fragments.join('');
                        }).join(''),
                        stroke: bandColor,
                    },
                ),
            );
        }
    }
    return createElement('g', {children: elements});
});
