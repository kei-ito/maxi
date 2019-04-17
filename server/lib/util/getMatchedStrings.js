"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchedStrings = (input, regexp) => {
    const result = [];
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
        }
        else {
            break;
        }
    }
    return result;
};
//# sourceMappingURL=getMatchedStrings.js.map