export const clamp = (
    value: number,
    min: number = -Infinity,
    max: number = Infinity,
) => {
    if (min < value) {
        if (value < max) {
            return value;
        }
        return max;
    }
    return min;
};
