import {getTickScale} from './getTickScale';
import {ITicks} from '../types';

const minuteInMS = 1000 * 60;
const hourInMS = minuteInMS * 60;
const dayInMS = hourInMS * 24;

export const getMillisecondsTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): ITicks | null => {
    const minTime = min.getTime();
    const maxTime = max.getTime();
    const scale = getTickScale(minTime, maxTime, numberOfTicks, [2, 5, 10]);
    if (scale) {
        const main: Array<number> = [];
        for (let value = scale.firstMain; value < maxTime; value += scale.mainScale) {
            main.push(new Date(value).getTime());
        }
        const sub: Array<number> = [];
        for (let value = scale.firstSub; value < maxTime; value += scale.subScale) {
            sub.push(new Date(value).getTime());
        }
        return {
            step: scale.step,
            stepOffset: scale.stepOffset,
            main,
            sub,
            min: min.getTime(),
            max: max.getTime(),
            toString: (value) => new Date(value).toISOString(),
        };
    }
    return null;
};

export const getSecondsTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): ITicks | null => {
    const minTime = min.getTime() / 1000;
    const maxTime = max.getTime() / 1000;
    const scale = getTickScale(minTime, maxTime, numberOfTicks, [2, 5, 10]);
    if (scale) {
        const main: Array<number> = [];
        for (let hour = scale.firstMain; hour < maxTime; hour += scale.mainScale) {
            main.push(new Date(hour * 1000).getTime());
        }
        const sub: Array<number> = [];
        for (let hour = scale.firstSub; hour < maxTime; hour += scale.subScale) {
            sub.push(new Date(hour * 1000).getTime());
        }
        return {
            step: scale.step,
            stepOffset: scale.stepOffset,
            main,
            sub,
            min: min.getTime(),
            max: max.getTime(),
            toString: (value) => new Date(value).toISOString().slice(0, -5),
        };
    }
    return null;
};

export const getMinuteTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): ITicks | null => {
    const minTime = min.getTime() / minuteInMS;
    const maxTime = max.getTime() / minuteInMS;
    const scale = getTickScale(minTime, maxTime, numberOfTicks, [5, 10, 15, 20, 30], 15);
    if (scale) {
        const main: Array<number> = [];
        for (let hour = scale.firstMain; hour < maxTime; hour += scale.mainScale) {
            main.push(new Date(hour * minuteInMS).getTime());
        }
        const sub: Array<number> = [];
        for (let hour = scale.firstSub; hour < maxTime; hour += scale.subScale) {
            sub.push(new Date(hour * minuteInMS).getTime());
        }
        return {
            step: scale.step,
            stepOffset: scale.stepOffset,
            sub,
            main,
            min: min.getTime(),
            max: max.getTime(),
            toString: (value) => new Date(value).toISOString().slice(0, -8),
        };
    }
    return null;
};

export const getHourTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): ITicks | null => {
    const minTime = min.getTime() / hourInMS;
    const maxTime = max.getTime() / hourInMS;
    const scale = getTickScale(minTime, maxTime, numberOfTicks, [6, 12, 24], 12);
    if (scale) {
        const main: Array<number> = [];
        for (let hour = scale.firstMain; hour < maxTime; hour += scale.mainScale) {
            main.push(new Date(hour * hourInMS).getTime());
        }
        const sub: Array<number> = [];
        for (let hour = scale.firstSub; hour < maxTime; hour += scale.subScale) {
            sub.push(new Date(hour * hourInMS).getTime());
        }
        return {
            step: scale.step,
            stepOffset: scale.stepOffset,
            sub,
            main,
            min: min.getTime(),
            max: max.getTime(),
            toString: (value) => new Date(value).toISOString().slice(0, -8),
        };
    }
    return null;
};

export const getDayTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): ITicks | null => {
    const minTime = min.getTime() / dayInMS;
    const maxTime = max.getTime() / dayInMS;
    const scale = getTickScale(minTime, maxTime, numberOfTicks, [5, 10, 20], 10);
    if (scale) {
        const main: Array<number> = [];
        for (let day = scale.firstMain; day < maxTime; day += scale.mainScale) {
            main.push(new Date(day * dayInMS).getTime());
        }
        const sub: Array<number> = [];
        for (let day = scale.firstSub; day < maxTime; day += scale.subScale) {
            sub.push(new Date(day * dayInMS).getTime());
        }
        return {
            step: scale.step,
            stepOffset: scale.stepOffset,
            sub,
            main,
            min: min.getTime(),
            max: max.getTime(),
            toString: (value) => new Date(value).toISOString().slice(0, -14),
        };
    }
    return null;
};

export const getMonthTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): ITicks | null => {
    const minMonth = min.getFullYear() * 12 + min.getMonth() + 1;
    const maxMonth = max.getFullYear() * 12 + max.getMonth() + 1;
    const scale = getTickScale(minMonth, maxMonth, numberOfTicks, [6, 12, 24], 12);
    if (scale) {
        const main: Array<number> = [];
        const mainStep = Math.max(scale.mainScale, 1);
        for (let month = scale.firstMain; month < maxMonth; month += mainStep) {
            const y = `${Math.floor(month / 12)}`.padStart(4, '0');
            const m = `${Math.floor(month % 12) + 1}`.padStart(2, '0');
            main.push(new Date(`${y}-${m}-01T00:00:00Z`).getTime());
        }
        const sub: Array<number> = [];
        for (let month = scale.firstSub; month < maxMonth; month += scale.subScale) {
            const y = `${Math.floor(month / 12)}`.padStart(4, '0');
            const m = `${Math.floor(month % 12) + 1}`.padStart(2, '0');
            sub.push(new Date(`${y}-${m}-01T00:00:00Z`).getTime());
        }
        return {
            step: scale.step,
            stepOffset: scale.stepOffset,
            sub,
            main,
            min: min.getTime(),
            max: max.getTime(),
            toString: (value) => new Date(value).toISOString().slice(0, -14),
        };
    }
    return null;
};

export const getDateTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): ITicks | null => {
    const range = max.getTime() - min.getTime();
    if (range < 1000) {
        return getMillisecondsTicks(min, max, numberOfTicks);
    } else if (range < minuteInMS * 2) {
        return getSecondsTicks(min, max, numberOfTicks);
    } else if (range < hourInMS * 2) {
        return getMinuteTicks(min, max, numberOfTicks);
    } else if (range < dayInMS * 2) {
        return getHourTicks(min, max, numberOfTicks);
    } else if (range < dayInMS * 30 * 2) {
        return getDayTicks(min, max, numberOfTicks);
    } else {
        return getMonthTicks(min, max, numberOfTicks);
    }
};
