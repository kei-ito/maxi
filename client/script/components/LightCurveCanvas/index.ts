import {useRef, useEffect, createElement, useState} from 'react';
import classes from './style.css';
// import {IObjectData, IObjectBin} from '../../types';
import {IPreferences, IBinnedLightCurveData} from '../../types';
import {ensureArray} from '../../util/ensureArray';

export interface ILightCurveProps {
    preferences: IPreferences,
    object: string | Array<string>,
    cache: Map<string, IBinnedLightCurveData>,
}

export const LightCurveCanvas = (
    props: ILightCurveProps,
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [renderId, setRenderId] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [fontFamily, setFontFamily] = useState('');
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
        const canvas = canvasRef.current;
        if (canvas) {
            setContext(canvas.getContext('2d'));
        }
    }, [canvasRef]);

    useEffect(() => {
        if (ctx) {
            setWidth(ctx.canvas.clientWidth);
            setHeight(ctx.canvas.clientHeight);
            setFontFamily(getComputedStyle(ctx.canvas).getPropertyValue('font-family'));
        }
    }, [ctx, renderId]);

    useEffect(() => {
        if (ctx) {
            ctx.canvas.width = width * devicePixelRatio;
            ctx.canvas.height = height * devicePixelRatio;
            render();
        }
    }, [ctx, width, height, fontFamily]);

    useEffect(() => {
        if (ctx) {
            ctx.save();
            ctx.scale(devicePixelRatio, devicePixelRatio);
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'currentColor';
            ctx.font = `normal normal 400 normal 16px / normal ${fontFamily}`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.stroke();
            ensureArray(props.object).forEach((key) => {
                const data = props.cache.get(key);
                if (data) {
                    const {bins, minX, rangeX, minY, rangeY} = data;
                    const scaleX = width / rangeX;
                    const scaleY = height / rangeY;
                    const PI2 = Math.PI * 2;
                    bins.forEach((bin) => {
                        const x = scaleX * (bin[0] - minX);
                        const y = scaleY * (bin[1] - minY);
                        const e = scaleY * bin[2];
                        ctx.beginPath();
                        ctx.moveTo(x, y - e);
                        ctx.lineTo(x, y + e);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, PI2);
                        ctx.fill();
                    });
                } else {
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`Loading ${key}`, width * 0.5, height * 0.5);
                }
            });
            ctx.restore();
        }
    }, [ctx, props.object, props.cache, renderId]);

    return createElement(
        'canvas',
        {
            className: classes.canvas,
            ref: canvasRef,
        },
    );
};
