export const normalizeSearchText = (
    input: string,
): string => input.replace(/\s+/, '').toLowerCase();
