import {useRef, useEffect, createElement, useState} from 'react';
import classes from './style.css';
import {IPreferences, IObjectMap, IRollingAverageData, IMargin} from '../../types';
import {getAreaHeight, bandCount} from '../../util/constants';
import {Cursor} from './Cursor';
import {Body} from './Body';

export interface ILightCurveProps {
    preferences: IPreferences,
    objects: Array<string>,
    objectMap: IObjectMap | null,
    cache: Map<string, IRollingAverageData>,
    setPreferences: (newPreferences: Partial<IPreferences>) => void,
}

const margin: IMargin = {
    left: 60,
    right: 0.5,
    top: 32,
    bottom: 32,
    gap: 6,
};

export const LightCurve = (
    props: ILightCurveProps,
) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [svgWidth, setSVGWidth] = useState(window.innerWidth * 0.94);
    const [areaHeight, setAreaHeight] = useState(getAreaHeight());
    const areaWidth = svgWidth - margin.left - margin.right;
    const [mjdRange, setMJDRange] = useState(props.preferences.mjdRange);
    const [cursor, __setCursor] = useState<{x: number, y: number} | null>(null);
    const setCursor = (
        event: MouseEvent | Touch,
    ) => {
        const svgElement = svgRef.current;
        if (svgElement) {
            const rect = svgElement.getBoundingClientRect();
            const x = event.clientX - rect.left - margin.left;
            if (0 < x && x < areaWidth) {
                const y = event.clientY - rect.top;
                __setCursor({x, y});
                return;
            }
        }
        __setCursor(null);
    };
    const svgHeight = margin.top + (areaHeight + margin.gap) * bandCount * (props.objects.length || 1) - margin.gap + margin.bottom;
    const rangeMJD = mjdRange[1] - mjdRange[0];

    useEffect(() => {
        const timeoutId = setTimeout(() => props.setPreferences({mjdRange}), 800);
        return () => clearTimeout(timeoutId);
    }, [mjdRange]);

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
                    setSVGWidth(parent.clientWidth);
                    setAreaHeight(getAreaHeight());
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

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) {
            return;
        }
        let dMin = 0;
        let dMax = 0;
        const onWheel = (event: WheelEvent) => {
            const rect = svgElement.getBoundingClientRect();
            const x = event.clientX - rect.left - margin.left;
            const dy = (rangeMJD - dMin + dMax) * event.deltaY / areaWidth;
            if (event.ctrlKey) {
                const r = x / areaWidth;
                dMin += dy * -r;
                dMax += dy * (1 - r);
                setMJDRange([mjdRange[0] + dMin, mjdRange[1] + dMax]);
                event.preventDefault();
            } else if (event.shiftKey) {
                dMin += dy;
                dMax += dy;
                setMJDRange([mjdRange[0] + dMin, mjdRange[1] + dMax]);
                event.preventDefault();
            }
        };
        const onMouseDown = (event: MouseEvent) => {
            event.preventDefault();
            const rect = svgElement.getBoundingClientRect();
            const x0 = rect.left + margin.left;
            const x1 = event.clientX - x0;
            const y1 = event.clientY;
            const L1 = x1 / areaWidth;
            const R1 = 1 - L1;
            const onMouseUp = () => {
                removeEventListener('mouseup', onMouseUp);
                removeEventListener('mousemove', onMouseMove);
            };
            const dMin0 = dMin;
            const dMax0 = dMax;
            const onMouseMove = (event: MouseEvent) => {
                const x2 = event.clientX - x0;
                const y2 = event.clientY;
                const dy = y2 - y1;
                const scale = 1.005 ** dy;
                const L2 = x2 / areaWidth;
                const R2 = 1 - L2;
                const dL = L1 * scale - L2;
                const dR = R1 * scale - R2;
                const newRangeMJD = (rangeMJD - dMin0 + dMax0) / scale;
                dMin = dMin0 + newRangeMJD * dL;
                dMax = dMax0 + newRangeMJD * -dR;
                setMJDRange([mjdRange[0] + dMin, mjdRange[1] + dMax]);
            };
            addEventListener('mouseup', onMouseUp, {passive: true});
            addEventListener('mousemove', onMouseMove, {passive: true});
        };
        const onTouchStart = (event: TouchEvent) => {
            const touch11 = event.touches.item(0);
            const touch12 = event.touches.item(1);
            if (touch11 && touch12) {
                event.preventDefault();
                const rect = svgElement.getBoundingClientRect();
                const x0 = rect.left + margin.left;
                const x11 = touch11.clientX - x0;
                const x12 = touch12.clientX - x0;
                const distance1 = Math.abs(x11 - x12);
                const x1 = (x11 + x12) / 2;
                const L1 = x1 / areaWidth;
                const R1 = 1 - L1;
                const dMin0 = dMin;
                const dMax0 = dMax;
                const onTouchEnd = (event: TouchEvent) => {
                    if (event.touches.length <= 1) {
                        removeEventListener('touchmove', onTouchEnd);
                        removeEventListener('touchend', onTouchStart);
                    }
                };
                const onToucheMove = (event: TouchEvent) => {
                    let touch21: Touch | null = null;
                    let touch22: Touch | null = null;
                    for (let index = event.touches.length; index--;) {
                        const touch = event.touches.item(index);
                        if (touch) {
                            const id = touch.identifier;
                            if (id === touch11.identifier) {
                                touch21 = touch;
                            } else if (id === touch12.identifier) {
                                touch22 = touch;
                            }
                        }
                    }
                    if (touch21 && touch22) {
                        const x21 = touch21.clientX - x0;
                        const x22 = touch22.clientX - x0;
                        const distance2 = Math.abs(x21 - x22);
                        const x2 = (x21 + x22) / 2;
                        const L2 = x2 / areaWidth;
                        const R2 = 1 - L2;
                        const scale = distance2 / distance1;
                        const dL = L1 * scale - L2;
                        const dR = R1 * scale - R2;
                        const newRangeMJD = (rangeMJD - dMin0 + dMax0) / scale;
                        dMin = dMin0 + newRangeMJD * dL;
                        dMax = dMax0 + newRangeMJD * -dR;
                        setMJDRange([mjdRange[0] + dMin, mjdRange[1] + dMax]);
                    } else {
                        onTouchEnd(event);
                    }
                };
                addEventListener('touchend', onTouchEnd, {passive: true});
                addEventListener('touchmove', onToucheMove, {passive: true});
            }
        };
        svgElement.addEventListener('wheel', onWheel);
        svgElement.addEventListener('mousedown', onMouseDown);
        svgElement.addEventListener('touchstart', onTouchStart);
        svgElement.addEventListener('mousemove', setCursor, {passive: true});
        svgElement.addEventListener('mouseleave', setCursor, {passive: true});
        return () => {
            svgElement.removeEventListener('wheel', onWheel);
            svgElement.removeEventListener('mousedown', onMouseDown);
            svgElement.removeEventListener('touchstart', onTouchStart);
            svgElement.removeEventListener('mousemove', setCursor);
            svgElement.removeEventListener('mouseleave', setCursor);
        };
    }, [svgRef.current, areaWidth]);

    return createElement(
        'svg',
        {
            width: svgWidth,
            height: svgHeight,
            className: classes.svg,
            ref: svgRef,
            viewBox: `0 0 ${svgWidth} ${svgHeight}`,
            fontSize: '14px',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none',
        },
        createElement(
            Cursor,
            {
                cursor,
                svgHeight,
                left: margin.left,
                areaWidth,
                minMJD: mjdRange[0],
                maxMJD: mjdRange[1],
            },
        ),
        createElement(
            Body,
            {
                objects: props.objects,
                objectMap: props.objectMap,
                cache: props.cache,
                minMJD: mjdRange[0],
                maxMJD: mjdRange[1],
                plotType: props.preferences.plotType,
                binSize: props.preferences.binSize,
                svgWidth,
                areaHeight,
                margin,
            },
        ),
    );
};
