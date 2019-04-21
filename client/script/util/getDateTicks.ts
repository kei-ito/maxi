import {getTickScale} from './getTickScale';
import {IDateTicks} from '../types';

export const getMillisecondsTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): IDateTicks | null => {
    const minTime = min.getTime();
    const maxTime = max.getTime();
    const scale = getTickScale(minTime, maxTime, numberOfTicks, [2, 5, 10]);
    if (scale) {
        const main: Array<Date> = [];
        for (let value = scale.firstMain; value < maxTime; value += scale.mainScale) {
            main.push(new Date(value));
        }
        const sub: Array<Date> = [];
        for (let value = scale.firstSub; value < maxTime; value += scale.subScale) {
            sub.push(new Date(value));
        }
        return Object.assign(scale, {
            main,
            sub,
            toString: (time: number) => {
                const date = new Date(time);
                return `${date.getSeconds()}.${`${date.getMilliseconds()}`.padStart(3, '0')}`;
            },
        });
    }
    return null;
};
export const getMinuteTicks = getMillisecondsTicks;
export const getHourTicks = getMinuteTicks;
export const getDayTicks = getHourTicks;

export const getMonthTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): IDateTicks | null => {
    const minMonth = min.getFullYear() * 12 + min.getMonth() + 1;
    const maxMonth = max.getFullYear() * 12 + max.getMonth() + 1;
    const scale = getTickScale(minMonth, maxMonth, numberOfTicks, [3, 6, 12, 24], 12);
    if (scale) {
        const main: Array<Date> = [];
        for (let month = scale.firstMain; month < maxMonth; month += scale.mainScale) {
            const y = `${Math.floor(month / 12)}`.padStart(4, '0');
            const m = `${Math.floor(month % 12) + 1}`.padStart(2, '0');
            main.push(new Date(`${y}-${m}-01T00:00:00Z`));
        }
        const sub: Array<Date> = [];
        for (let month = scale.firstSub; month < maxMonth; month += scale.subScale) {
            const y = `${Math.floor(month / 12)}`.padStart(4, '0');
            const m = `${Math.floor(month % 12) + 1}`.padStart(2, '0');
            sub.push(new Date(`${y}-${m}-01T00:00:00Z`));
        }
        return {
            step: scale.step,
            stepOffset: scale.stepOffset,
            sub,
            main,
            toString: (time: Date) => {
                const date = new Date(time);
                return [
                    date.getFullYear(),
                    `${date.getMonth() + 1}`.padStart(2, '0'),
                    `${date.getDate()}`.padStart(2, '0'),
                ].join('-');
            },
        };
    }
    return null;
};

export const getDateTicks = (
    min: Date,
    max: Date,
    numberOfTicks: number,
): IDateTicks | null => {
    const range = max.getTime() - min.getTime();
    if (range < 1000 * 5) {
        return getMillisecondsTicks(min, max, numberOfTicks);
    } else if (range < 1000 * 60 * 60) {
        return getMinuteTicks(min, max, numberOfTicks);
    } else if (range < 1000 * 60 * 60 * 24) {
        return getHourTicks(min, max, numberOfTicks);
    } else if (range < 1000 * 60 * 60 * 24 * 30) {
        return getDayTicks(min, max, numberOfTicks);
    } else {
        return getMonthTicks(min, max, numberOfTicks);
    }
};
