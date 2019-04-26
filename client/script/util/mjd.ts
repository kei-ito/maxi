export const MJDEpochDate = new Date('1858-11-17T00:00:00Z').getTime();
export const mjdToDate = (mjd: number): Date => new Date(MJDEpochDate + mjd * 1000 * 60 * 60 * 24);
export const dateToMJD = (date: Date | number): number => (new Date(date).getTime() - MJDEpochDate) / (1000 * 60 * 60 * 24);
