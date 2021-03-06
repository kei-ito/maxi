import {createElement, ReactElement, memo} from 'react';
import {Band, IRollingAverageData, PlotType, IMargin} from '../../types';
import {bandCount} from '../../util/constants';
import {Area} from './Area';
import * as catalog from '../../util/catalog';

interface IBodyProps {
    objects: Array<string>,
    cache: Map<string, IRollingAverageData>,
    minMJD: number,
    maxMJD: number,
    plotType: PlotType,
    binSize: number,
    svgWidth: number,
    areaHeight: number,
    margin: IMargin,
}

export const Body = memo((
    {
        objects,
        cache,
        minMJD,
        maxMJD,
        plotType,
        binSize,
        svgWidth,
        areaHeight,
        margin,
    }: IBodyProps,
) => {
    const areaWidth = svgWidth - margin.left - margin.right;
    const children: Array<ReactElement> = [];
    [Band.$2_20, Band.$2_4, Band.$4_10, Band.$10_20].forEach((band, bandIndex) => {
        objects.forEach((objectId, objectIndex) => {
            const index = objects.length * bandIndex + objectIndex;
            const bottom = margin.top + areaHeight * (index + 1) + margin.gap * index;
            const top = bottom - areaHeight;
            children.push(createElement(
                Area,
                {
                    key: index,
                    band,
                    left: margin.left,
                    right: svgWidth - margin.right,
                    top,
                    bottom,
                    lineHeight: margin.lineHeight,
                    width: areaWidth,
                    height: areaHeight,
                    minMJD,
                    maxMJD,
                    binSize,
                    object: catalog.map.get(objectId),
                    data: cache.get(objectId),
                    plotType,
                    isFirst: index === 0,
                    isLast: index === bandCount * objects.length - 1,
                },
            ));
        });
    });
    return createElement('g', {children});
});
