import {useRef, useEffect, createElement, useState, ReactSVGElement, Fragment} from 'react';
import classes from './style.css';
// import {IObjectData, IObjectBin} from '../../types';
import {IPreferences, IBinnedLightCurveData} from '../../types';
import {isString} from '../../util/isString';
import {getTicks} from '../../util/getTicks';

export interface ILightCurveProps {
    preferences: IPreferences,
    objects: Array<string | null>,
    cache: Map<string, IBinnedLightCurveData>,
}

export const LightCurve = (
    props: ILightCurveProps,
) => {
    const svgRef = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const cancel = () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
        const onResize = () => {
            cancel();
            timeoutId = setTimeout(() => {
                const svg = svgRef.current;
                const parent = svg && svg.parentElement;
                if (parent) {
                    setWidth(parent.clientWidth);
                    setHeight(window.innerHeight * 0.5);
                }
            }, 400);
        };
        addEventListener('resize', onResize);
        onResize();
        return () => {
            cancel();
            removeEventListener('resize', onResize);
        };
    }, []);

    const plots: Array<{
        id: string,
        data: IBinnedLightCurveData,
        index: number,
    }> = [];

    let minX = Infinity;
    let maxX = 0;
    let minY = Infinity;
    let maxY = 0;

    props.objects.forEach((id, index) => {
        if (isString(id)) {
            const data = props.cache.get(id);
            if (data) {
                minX = Math.min(minX, data.minX);
                maxX = Math.max(maxX, data.maxX);
                minY = Math.min(minY, data.minY);
                maxY = Math.max(maxY, data.maxY);
                plots.push({id, data, index});
            }
        }
    });

    const margin = [10, 10, 40, 40];
    const areaWidth = width - margin[1] - margin[3];
    const areaHeight = height - margin[2] - margin[0];
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const scaleX = areaWidth / rangeX;
    const scaleY = areaHeight / rangeY;
    const x0 = margin[3];
    const y0 = height - margin[2];
    const X = (mjd: number) => x0 + scaleX * (mjd - minX);
    const Y = (flux: number) => y0 - scaleY * (flux - minY);

    return createElement(
        'svg',
        {
            width,
            height,
            className: classes.svg,
            ref: svgRef,
            viewBox: `0 0 ${width} ${height}`,
        },
        0 < scaleX * scaleY && createElement(
            Fragment,
            null,
            createElement(
                'path',
                {d: `M${X(minX)},${Y(maxY)}V${Y(minY)}H${X(maxX)}`},
            ),
            createElement(
                'text',
                {
                    x: X((maxX + minX) * 0.5),
                    y: Y(minY),
                    className: classes.yLabel,
                },
                `Count ${width}x${height}`
            ),
            ...getTicks(minX, maxX).map((mjd) => createElement(
                'text',
                {
                    x: X(mjd),
                    y: Y(minY) + margin[2] * 0.5,
                },
                `${mjd.toFixed(0)}`,
            )),
        ),
        ...plots.map(({id, data, index}) => {
            const elements: Array<ReactSVGElement> = [];
            data.bins.forEach(([leftMJD, rightMJD, flux, error]) => {
                const xL = X(leftMJD);
                const xR = X(rightMJD);
                const x = (xL + xR) * 0.5;
                const y = Y(flux);
                const e = error * scaleY;
                elements.push(createElement(
                    'path',
                    {
                        key: elements.length,
                        d: `M${x},${y - e}V${y + e}`,
                    },
                ));
                elements.push(createElement(
                    'path',
                    {
                        key: elements.length,
                        d: `M${xL},${y}H${xR}`,
                    },
                ));
                // elements.push(createElement(
                //     'circle',
                //     {
                //         key: elements.length,
                //         cx: x,
                //         cy: y,
                //         r: 1,
                //     },
                // ));
            });
            return createElement(
                'g',
                {
                    'className': classes.object,
                    'data-object': id,
                    'data-color': index % 7,
                    'children': elements,
                },
            );
        }),
    );
};
