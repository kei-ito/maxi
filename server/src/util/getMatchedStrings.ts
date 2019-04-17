export const getMatchedStrings = (
    input: string,
    regexp: RegExp,
): Array<string> => {
    const result: Array<string> = [];
    const isNotGlobal = !regexp.flags.includes('g');
    while (1) {
        const match = regexp.exec(input);
        if (match) {
            for (let index = 1; index < match.length; index++) {
                result.push(match[index].trim());
            }
            if (isNotGlobal) {
                break;
            }
        } else {
            break;
        }
    }
    return result;
};
