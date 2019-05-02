export const clamp = (
    value: number,
    min: number,
    max: number,
) => {
    if (min < value) {
        if (value < max) {
            return value;
        }
        return max;
    }
    return min;
};
