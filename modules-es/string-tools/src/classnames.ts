export const classnames = (...args: Array<string | null | undefined | false>): string => args
.filter((value) => typeof value === 'string' && value)
.join(' ');
