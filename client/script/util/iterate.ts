export const iterate = <TType>(
    iterator: Iterator<TType>,
    fn: (value: TType, index: number) => boolean | void,
): Iterator<TType> => {
    let index = 0;
    while (1) {
        const result = iterator.next();
        if (result.done) {
            break;
        }
        if (fn(result.value, index++)) {
            break;
        }
    }
    return iterator;
};
