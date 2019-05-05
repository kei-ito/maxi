import {MJDEpochDate, DAY_MS} from './constants';
export const mjdToDate = (mjd: number): Date => new Date(MJDEpochDate + mjd * DAY_MS);
