import {useRef, useEffect, createElement, useState, ReactSVGElement, Fragment} from 'react';
import classes from './style.css';
import {IPreferences, IBinnedLightCurveData} from '../../types';
import {isString} from '../../util/isString';
import {getTicks} from '../../util/getTicks';
import {getDateTicks} from '../../util/getDateTicks';
import {mjdToDate, dateToMJD} from '../../util/mjd';
import {classnames} from '../../util/classnames';

export const createTextPositionFixer = (
    index: number,
    length: number,
    margin: [number, number, number, number],
) => {
    if (index === 0) {
        return (element: SVGTextElement | null) => {
            if (!element) {
                return;
            }
            const parent = element.parentElement;
            if (!parent) {
                return;
            }
            const x = Number(element.getAttribute('data-x'));
            const minX = margin[3] + element.getBoundingClientRect().width * 0.5;
            element.setAttribute('x', `${Math.max(x, minX)}`);
        };
    }
    if (index === length - 1) {
        return (element: SVGTextElement | null) => {
            if (!element) {
                return;
            }
            const parent = element.parentElement;
            if (!parent) {
                return;
            }
            const x = Number(element.getAttribute('data-x'));
            const right = x + element.getBoundingClientRect().width * 0.5;
            const d = parent.getBoundingClientRect().width - right;
            element.setAttribute('x', `${Math.min(x, x + d)}`);
        };
    }
    return null;
};

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
    const [dx, setDx] = useState(0);

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
                minX = Math.min(minX, data.minX) + dx;
                maxX = Math.max(maxX, data.maxX) + dx;
                minY = Math.min(minY, data.minY);
                maxY = Math.max(maxY, data.maxY);
                plots.push({id, data, index});
            }
        }
    });

    const margin: [number, number, number, number] = [18, 0.5, 18, 45];
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
    const isReady = 0 < scaleX && 0 < scaleY;

    const xTicks = isReady ? getTicks(minX, maxX, areaWidth / 160) : null;
    const xDateTicks = isReady ? getDateTicks(mjdToDate(minX), mjdToDate(maxX), areaWidth / 160) : null;
    const yTicks = isReady ? getTicks(minY, maxY, areaHeight / 100) : null;

    const left = X(minX);
    const right = X(maxX);
    const top = Y(maxY);
    const bottom = Y(minY);
    const centerY = (top + bottom) * 0.5;

    return createElement(
        'svg',
        {
            width,
            height,
            className: classes.svg,
            ref: svgRef,
            viewBox: `0 0 ${width} ${height}`,
            onWheel: (event) => {
                if (event.shiftKey) {
                    setDx(dx + event.deltaY);
                }
            },
        },
        isReady && createElement(
            Fragment,
            null,
            createElement(
                'text',
                {
                    className: classnames(classes.alignTop, classes.alignCenter),
                    x: 3,
                    y: centerY,
                    transform: `rotate(-90, 3,${centerY})`,
                },
                'Photons cm',
                createElement('tspan', {dy: -3}, '-2'),
                createElement('tspan', {dy: +3}, ' s'),
                createElement('tspan', {dy: -3}, '-1'),
            ),
            createElement(
                'path',
                {
                    d: [
                        `M${left},${bottom}`,
                        ...(yTicks ? yTicks.sub.map((flux, index) => {
                            const tickSize = (index - yTicks.stepOffset) % yTicks.step === 0 ? 10 : 5;
                            return `V${Y(flux)}h${tickSize}h${-tickSize}`;
                        }) : []),
                        `V${top}`,
                        ...(xDateTicks ? xDateTicks.sub.map((date, index) => {
                            const tickSize = (index - xDateTicks.stepOffset) % xDateTicks.step === 0 ? 10 : 5;
                            return `H${X(dateToMJD(date))}v${tickSize}v${-tickSize}`;
                        }) : []),
                        `H${right}`,
                        `V${bottom}`,
                        ...(xTicks ? xTicks.sub.map((mjd, index) => {
                            const tickSize = (index - xTicks.stepOffset) % xTicks.step === 0 ? 10 : 5;
                            return `H${X(mjd)}v${-tickSize}v${tickSize}`;
                        }).reverse() : []),
                        'z',
                    ].join(''),
                },
            ),
        ),
        yTicks && createElement(
            Fragment,
            null,
            ...yTicks.main.map((flux) => {
                return createElement(
                    'text',
                    {
                        className: classnames(classes.alignMiddle, classes.alignRight),
                        x: left - 4,
                        y: Y(flux),
                    },
                    `${flux.toFixed(1)}`,
                );
            }),
        ),
        xTicks && createElement(
            Fragment,
            null,
            ...xTicks.main.map((mjd, index) => {
                const x = X(mjd);
                return createElement(
                    'text',
                    {
                        'data-x': x,
                        'className': classnames(classes.alignTop, classes.alignCenter),
                        'x': x,
                        'y': bottom + 4,
                        'ref': createTextPositionFixer(index, xTicks.main.length, margin),
                    },
                    `${mjd.toFixed(0)}`,
                );
            }),
        ),
        xDateTicks && createElement(
            Fragment,
            null,
            ...xDateTicks.main.map((date, index) => {
                const x = X(dateToMJD(date));
                return createElement(
                    'text',
                    {
                        'data-x': x,
                        'className': classnames(classes.alignBottom, classes.alignCenter),
                        'x': x,
                        'y': top - 4,
                        'ref': createTextPositionFixer(index, xDateTicks.main.length, margin),
                    },
                    `${xDateTicks.toString(date)}`,
                );
            }),
        ),
        ...plots.map(({id, data, index}) => {
            const elements: Array<ReactSVGElement> = [];
            data.bins.forEach((bin) => {
                const xL = X(bin[0]);
                const xR = X(bin[1]);
                const x = (xL + xR) * 0.5;
                for (let index = 2; index < 9; index += 2) {
                    const y = Y(bin[index]);
                    const e = bin[index + 1] * scaleY;
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
                }
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
