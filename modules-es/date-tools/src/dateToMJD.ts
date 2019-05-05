import {MJDEpochDate, DAY_MS} from './constants';
export const dateToMJD = (date: Date | number): number => (new Date(date).getTime() - MJDEpochDate) / DAY_MS;
