import {useRef, useEffect, createElement, useState, ReactSVGElement} from 'react';
import classes from './style.css';
// import {IMAXIObjectData, IMAXIObjectBin} from '../../types';
import {IPreferences, IMAXIBinnedLightCurveData} from '../../types';
import {ensureArray} from '../../util/ensureArray';

export interface ILightCurveProps {
    preferences: IPreferences,
    object: string | Array<string>,
    cache: Map<string, IMAXIBinnedLightCurveData>,
}

export const LightCurve = (
    props: ILightCurveProps,
) => {
    const svgRef = useRef<HTMLCanvasElement>(null);
    const [renderId, setRenderId] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const render = () => setRenderId(renderId + 1);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const cancel = () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
        const onResize = () => {
            cancel();
            timeoutId = setTimeout(render, 400);
        };
        addEventListener('resize', onResize);
        return () => {
            cancel();
            removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        const svg = svgRef.current;
        const parent = svg && svg.parentElement;
        if (parent) {
            setWidth(parent.clientWidth);
            setHeight(window.innerHeight * 0.5);
        }
    });

    const margin = [20, 20, 40, 40];
    const areaWidth = width - margin[1] - margin[3];
    const areaHeight = height - margin[0] - margin[2];

    return createElement(
        'svg',
        {
            width,
            height,
            className: classes.svg,
            ref: svgRef,
            viewBox: `${-margin[3]} ${-margin[2]} ${width} ${height}`,
        },
        createElement(
            'g',
            {
                children: ensureArray(props.object).map((objectId) => {
                    const data = props.cache.get(objectId);
                    if (!data) {
                        return null;
                    }
                    const {minX, minY} = data;
                    const elements: Array<ReactSVGElement> = [];
                    const scaleX = areaWidth / data.rangeX;
                    const scaleY = areaHeight / data.rangeY;
                    data.bins.forEach(([mjd, flux, error]) => {
                        const x = (mjd - minX) * scaleX;
                        const y = (flux - minY) * scaleY;
                        const e = error * scaleY;
                        elements.push(createElement(
                            'path',
                            {
                                key: elements.length,
                                d: `M${x},${y - e}V${y + e}`,
                            },
                        ));
                        elements.push(createElement(
                            'circle',
                            {
                                key: elements.length,
                                cx: x,
                                cy: y,
                                r: 2,
                            },
                        ));
                    });
                    return createElement(
                        'g',
                        {
                            'key': objectId,
                            'className': classes.object,
                            'data-object': objectId,
                            'children': elements,
                        },
                    );
                }),
            },
        ),
        createElement(
            'path',
            {d: `M0,${areaHeight}V0H${areaWidth}`},
        ),
        createElement(
            'text',
            {
                x: 0,
                y: 0,
                className: classes.yLabel,
            },
            `Count ${renderId}`
        ),
    );
};
