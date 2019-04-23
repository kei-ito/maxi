export const ensureArray = <TType>(
    value: TType | Array<TType>,
): Array<TType> => Array.isArray(value) ? value : [value];
