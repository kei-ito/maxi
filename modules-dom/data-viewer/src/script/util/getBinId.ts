export const getBinId = (
    mjd: number,
    binSize: number,
): number => Math.floor(mjd / binSize);
