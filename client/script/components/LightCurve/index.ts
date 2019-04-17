import {useRef, useEffect, createElement, useState} from 'react';
import classes from './style.css';
import {IMAXIObjectData} from '../../types';
// import {IMAXIObjectData, IMAXIObjectBin} from '../../types';
import {getData} from '../../util/getData';
import {alertError} from '../../util/alertError';
import {iterate} from '../../util/iterate';

export interface ILightCurveProps {
    selected: Array<string>,
    binSize: number,
}

export const getBinId = (
    mjd: number,
    binSize: number,
): number => Math.floor(mjd / binSize);

export const binning = (
    data: IMAXIObjectData,
    _binSize: number,
): IMAXIObjectData => {
    // const binned: IMAXIObjectData = [];
    // let currentBin: IMAXIObjectBin = data[0];
    // if (currentBin) {
    //     let currentBinId: number = getBinId(currentBin[0], binSize);
    //     const {length} = data;
    //     for (let index = 1; index < length; index++) {
    //         const bin = data[index];
    //         const [mjd, b2_20, e2_20, b2_4, e2_4, b4_10, e4_10, b10_20, e10_20] = bin;
    //         const binId = getBinId(mjd, binSize);
    //         if (binId === currentBinId) {
    //         } else {
    //         }
    //     }
    // }
    // return binned;
    return data;
};

export const LightCurve = (
    props: ILightCurveProps,
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cache, updateCache] = useState(new Map<string, IMAXIObjectData>());
    const [binned, updateBinned] = useState(new Map<string, IMAXIObjectData>());
    const [count, setCount] = useState(0);
    const render = () => setCount(count + 1);
    useEffect(() => {
        for (const objectId of props.selected) {
            if (!cache.has(objectId)) {
                cache.set(objectId, []);
                getData(objectId)
                .then((data) => {
                    const newCache = new Map(cache);
                    newCache.set(objectId, data);
                    updateCache(newCache);
                    render();
                })
                .catch((error) => {
                    alertError(error);
                });
            }
        }
    }, [props.selected]);
    useEffect(() => {
        const newBinned = new Map<string, IMAXIObjectData>();
        for (const objectId of props.selected) {
            const cached = cache.get(objectId);
            if (cached && !binned.has(objectId)) {
                newBinned.set(objectId, binning(cached, props.binSize));
            }
        }
        if (0 < newBinned.size) {
            iterate(binned.entries(), ([objectId, data]) => {
                newBinned.set(objectId, data);
            });
            updateBinned(newBinned);
            render();
        }
    }, [props.binSize, cache]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas && canvas.getContext('2d');
        if (canvas && ctx) {
            const dpr = devicePixelRatio;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            ctx.fillStyle = 'currentColor';
            ctx.font = getComputedStyle(canvas).getPropertyValue('font');
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.stroke();
            ctx.fillText(`Frame ${count}`, width * 0.5, height * 0.5);
            for (const objectId of props.selected) {
                const data = binned.get(objectId) || [];
                const start = data[0];
                if (start) {
                    const {length} = data;
                    const end = data[length - 1];
                    const t0 = start[0];
                    const range = end[0] - t0;
                    for (let index = 1; index < length; index++) {
                        const bin = data[index];
                        const x = width * (bin[0] - t0) / range;
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, bin[1] * 1000);
                        ctx.stroke();
                    }
                }
            }
        }
    }, [count]);
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
    });
    return createElement(
        'canvas',
        {
            className: classes.canvas,
            ref: canvasRef,
        },
    );
};
