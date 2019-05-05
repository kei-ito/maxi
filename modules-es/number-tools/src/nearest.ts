export const nearest = (
    candidates: Array<number>,
    targetValue: number,
): number => candidates.reduce(
    (candidate1, candidate2) => {
        const diff1 = Math.abs(candidate1 - targetValue);
        const diff2 = Math.abs(candidate2 - targetValue);
        return diff1 < diff2 ? candidate1 : candidate2;
    },
);
