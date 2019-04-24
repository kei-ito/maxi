import {useRef, useEffect, createElement, useState, ReactSVGElement, Fragment} from 'react';
import classes from './style.css';
import {IPreferences, Band, BandTitles, IObjectMap, IRollingAverageData, PlotType, IRollingAverageBin} from '../../types';
import {getTicks} from '../../util/getTicks';
import {getDateTicks} from '../../util/getDateTicks';
import {mjdToDate, dateToMJD} from '../../util/mjd';
import {classnames} from '../../util/classnames';

interface ILightCurveProps {
    preferences: IPreferences,
    objects: Array<string>,
    objectMap: IObjectMap | null,
    cache: Map<string, IRollingAverageData>,
    setPreferences: (newPreferences: Partial<IPreferences>) => void,
}

interface IMargin {
    left: number,
    right: number,
    top: number,
    bottom: number,
    gap: number,
}

const bandCount = 4;
const margin: IMargin = {
    left: 46,
    right: 0.5,
    top: 18,
    bottom: 18,
    gap: 6,
};
const mainTickSize = 10;
const subTickSize = 5;
const getAreaHeight = () => window.innerHeight * 0.2;

export const createTextPositionFixer = (
    index: number,
    length: number,
    margin: IMargin,
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
            const minMJD = margin.left + element.getBoundingClientRect().width * 0.5;
            element.setAttribute('x', `${Math.max(x, minMJD)}`);
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

export const getXTicks = (
    minMJD: number,
    maxMJD: number,
    numberOfTicks: number,
) => {
    const mjd = getTicks(minMJD, maxMJD, numberOfTicks);
    const date = getDateTicks(mjdToDate(minMJD), mjdToDate(maxMJD), numberOfTicks);
    return mjd && date ? {mjd, date} : null;
};

export const LightCurve = (
    props: ILightCurveProps,
) => {
    const svgRef = useRef<HTMLCanvasElement>(null);
    const [svgWidth, setSVGWidth] = useState(window.innerWidth * 0.94);
    const [areaHeight, setAreaHeight] = useState(getAreaHeight());
    const areaWidth = svgWidth - margin.left - margin.right;
    const [mjdRange, setMJDRange] = useState(props.preferences.mjdRange);
    const [xTicks, setXTicks] = useState(getXTicks(mjdRange[0], mjdRange[1], areaWidth / 160));
    const [cursor, setCursor] = useState<{x: number, y: number} | null>(null);
    const svgHeight = margin.top + (areaHeight + margin.gap) * bandCount * (props.objects.length || 1) - margin.gap + margin.bottom;
    const rangeMJD = mjdRange[1] - mjdRange[0];
    const left = margin.left;
    const right = left + areaWidth;
    const X = (mjd: number) => left + (areaWidth / rangeMJD) * (mjd - mjdRange[0]);
    const xToMJD = (x: number) => mjdRange[0] + (x - margin.left) * rangeMJD / areaWidth;

    useEffect(() => {
        setXTicks(getXTicks(mjdRange[0], mjdRange[1], areaWidth / 160));
    }, [mjdRange, areaWidth]);

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
        let dMin = 0;
        let dMax = 0;
        const onWheel = (event: WheelEvent) => {
            const svgElement = svgRef.current;
            if (svgElement) {
                const rect = svgElement.getBoundingClientRect();
                const x = event.clientX - rect.left;
                if (left <= x && x <= right) {
                    const dy = (rangeMJD - dMin + dMax) * event.deltaY / areaWidth;
                    if (event.ctrlKey) {
                        const r = (x - left) / areaWidth;
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
                }
            }
        };
        const onMouseDown = (event: MouseEvent) => {
            const svgElement = svgRef.current;
            if (svgElement) {
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
            }
        };
        const onTouchStart = (event: TouchEvent) => {
            const svgElement = svgRef.current;
            const touch11 = event.touches.item(0);
            const touch12 = event.touches.item(1);
            if (svgElement && touch11 && touch12) {
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
                        setMJDRange([mjdRange[0] + dMin, mjdRange[0] + dMax]);
                    } else {
                        onTouchEnd(event);
                    }
                };
                addEventListener('touchend', onTouchEnd, {passive: true});
                addEventListener('touchmove', onToucheMove, {passive: true});
            }
        };
        const svg = svgRef.current;
        if (svg) {
            svg.addEventListener('wheel', onWheel);
            svg.addEventListener('mousedown', onMouseDown);
            svg.addEventListener('touchstart', onTouchStart);
        }
        return () => {
            if (svg) {
                svg.removeEventListener('wheel', onWheel);
                svg.removeEventListener('mousedown', onMouseDown);
                svg.removeEventListener('touchstart', onTouchStart);
            }
        };
    }, [svgRef, areaWidth]);

    return createElement(
        'svg',
        {
            width: svgWidth,
            height: svgHeight,
            className: classes.svg,
            ref: svgRef,
            viewBox: `0 0 ${svgWidth} ${svgHeight}`,
            onMouseMove: (event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = event.clientX - rect.left;
                if (left <= x && x <= right) {
                    const y = event.clientY - rect.top;
                    setCursor({x, y});
                } else {
                    setCursor(null);
                }
            },
            onMouseLeave: () => {
                setCursor(null);
            },
        },
        cursor && createElement(
            Fragment,
            null,
            createElement(
                'path',
                {
                    className: classes.cursorLine,
                    d: `M${cursor.x},1V${svgHeight - 1}`,
                },
            ),
            createElement(
                'text',
                {
                    className: classes.cursorText,
                    x: cursor.x + 2,
                    y: cursor.y - 12,
                },
                `${xToMJD(cursor.x).toFixed(0)}MJD`,
            ),
            createElement(
                'text',
                {
                    className: classes.cursorText,
                    x: cursor.x + 2,
                    y: cursor.y - 2,
                },
                `${mjdToDate(xToMJD(cursor.x)).toISOString().split('T')[0]}`,
            ),
        ),
        xTicks && createElement(
            Fragment,
            null,
            ...xTicks.date.main.map((date, index) => {
                const x = X(dateToMJD(date));
                return createElement(
                    'text',
                    {
                        'data-x': x,
                        'className': classnames(classes.alignBottom, classes.alignCenter),
                        'x': x,
                        'y': margin.top - 4,
                        'ref': createTextPositionFixer(index, xTicks.date.main.length, margin),
                    },
                    `${xTicks.date.toString(date)}`,
                );
            }),
            ...xTicks.mjd.main.map((mjd, index) => {
                const x = X(mjd);
                return createElement(
                    'text',
                    {
                        'data-x': x,
                        'className': classnames(classes.alignTop, classes.alignCenter),
                        'x': x,
                        'y': svgHeight - margin.bottom + 4,
                        'ref': createTextPositionFixer(index, xTicks.mjd.main.length, margin),
                    },
                    `${mjd.toFixed(0)}`,
                );
            }),
        ),
        ...[Band.$2_20, Band.$2_4, Band.$4_10, Band.$10_20].map((band) => {
            const bandTitle = BandTitles[band];
            return createElement(
                Fragment,
                null,
                ...props.objects.map((id, objectIndex) => {
                    const index = props.objects.length * band + objectIndex;
                    const fluxIndex = band * 2 + 3;
                    const errorIndex = band * 2 + 4;
                    const bottom = margin.top + areaHeight * (index + 1) + margin.gap * index;
                    const top = bottom - areaHeight;
                    const centerY = (top + bottom) * 0.5;
                    const elements: Array<ReactSVGElement> = [
                        createElement(
                            'text',
                            {
                                key: 'yTitle',
                                className: classnames(classes.alignTop, classes.alignCenter),
                                x: 4,
                                y: centerY,
                                transform: `rotate(-90, 3,${centerY})`,
                            },
                            'Photons cm\u207B\u00B2 s\u207B\u00B9',
                        ),
                        createElement(
                            'rect',
                            {
                                key: 'frame',
                                x: left,
                                y: top,
                                width: areaWidth,
                                height: areaHeight,
                            },
                        ),
                    ];
                    const object = props.objectMap && props.objectMap.get(id);
                    if (object) {
                        elements.push(createElement(
                            'text',
                            {
                                key: 'title',
                                className: classnames(classes.alignTop, classes.alignLeft),
                                x: left + mainTickSize + 4,
                                y: top + mainTickSize + 3,
                            },
                            `${object.name} (${object.id}) ${bandTitle}`,
                        ));
                    }
                    const mjdTicks = xTicks && xTicks.mjd;
                    const dateTicks = xTicks && xTicks.date;
                    const data = props.cache.get(id);
                    if (data) {
                        const minY = data.minY[band];
                        const maxY = data.maxY[band];
                        const rangeY = maxY - minY;
                        const scaleY = areaHeight / rangeY;
                        const Y = (flux: number) => bottom - scaleY * (flux - minY);
                        const yTicks = getTicks(minY, maxY, areaHeight / 100);
                        elements.push(
                            createElement(
                                'path',
                                {
                                    key: 'ticks',
                                    d: [
                                        (yTicks ? yTicks.sub.map((flux, index) => `M${left},${Y(flux)}h${(index - yTicks.stepOffset) % yTicks.step === 0 ? mainTickSize : subTickSize}`).join('') : ''),
                                        (dateTicks ? dateTicks.sub.map((date, index) => `M${X(dateToMJD(date))},${top}v${(index - dateTicks.stepOffset) % dateTicks.step === 0 ? mainTickSize : subTickSize}`).join('') : ''),
                                        (mjdTicks ? mjdTicks.sub.map((mjd, index) => `M${X(mjd)},${bottom}v${-((index - mjdTicks.stepOffset) % mjdTicks.step === 0 ? mainTickSize : subTickSize)}`).join('') : ''),
                                    ].join(''),
                                },
                            ),
                        );
                        if (yTicks) {
                            elements.push(
                                ...yTicks.main.map((flux, index) => createElement(
                                    'text',
                                    {
                                        key: `yLabel-${index}`,
                                        className: classnames(classes.alignMiddle, classes.alignRight),
                                        x: left - 4,
                                        y: Y(flux),
                                    },
                                    `${flux.toFixed(1)}`,
                                )),
                            );
                        }
                        if (props.preferences.plotType === PlotType.Line) {
                            let previousBinEndMJD = -1;
                            let bins: Array<IRollingAverageBin> = [];
                            const errorD: Array<string> = [];
                            const flushErrorPath = () => {
                                if (0 < bins.length) {
                                    errorD.push([
                                        `M${bins.map((bin) => `${X(bin[0])},${Y(bin[fluxIndex] + bin[fluxIndex + 1])}`).join('L')}`,
                                        `L${bins.reverse().map((bin) => `${X(bin[0])},${Y(bin[fluxIndex] - bin[fluxIndex + 1])}`).join('L')}z`,
                                        'z',
                                    ].join(''));
                                }
                                bins = [];
                            };
                            const rollingAverageD = data.bins.map((bin) => {
                                const x = X(bin[0]);
                                const y = Y(bin[fluxIndex]);
                                const jump = previousBinEndMJD < bin[1];
                                previousBinEndMJD = bin[2];
                                if (left <= x && x <= right) {
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
                                            className: classnames(classes.plot, classes.error),
                                            key: `${PlotType.Line}-error`,
                                            d: errorD.join(''),
                                        },
                                    ),
                                    createElement(
                                        'path',
                                        {
                                            className: classes.plot,
                                            key: PlotType.Line,
                                            d: `M${rollingAverageD.slice(1)}`,
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
                                        className: classes.plot,
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
                                                if (left <= x && x <= right) {
                                                    fragments.push(`M${x},${y - e}V${y + e}M${Math.max(left, xL)},${y}H${Math.min(right, xR)}`);
                                                }
                                            }
                                            return fragments.join('');
                                        }).join(''),
                                    },
                                ),
                            );
                        }
                    } else {
                        elements.push(
                            createElement(
                                'path',
                                {
                                    key: 'ticks',
                                    d: [
                                        (dateTicks ? dateTicks.sub.map((date, index) => `M${X(dateToMJD(date))},${top}v${(index - dateTicks.stepOffset) % dateTicks.step === 0 ? mainTickSize : subTickSize}`).join('') : ''),
                                        (mjdTicks ? mjdTicks.sub.map((mjd, index) => `M${X(mjd)},${bottom}v${-((index - mjdTicks.stepOffset) % mjdTicks.step === 0 ? mainTickSize : subTickSize)}`).join('') : ''),
                                    ].join(''),
                                },
                            ),
                        );
                    }
                    return createElement(
                        'g',
                        {
                            'data-object': id,
                            'data-band': bandTitle,
                            'children': elements,
                        },
                    );
                }),
            );
        }),
    );
};
