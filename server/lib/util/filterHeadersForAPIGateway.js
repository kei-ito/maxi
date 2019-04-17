"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHeaderValueForAPIGateway = (value) => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};
exports.filterHeadersForAPIGateway = (header) => {
    const result = {};
    for (const [key, value] of Object.entries(header)) {
        if (typeof value !== 'undefined') {
            result[key] = exports.filterHeaderValueForAPIGateway(value);
        }
    }
    return result;
};
//# sourceMappingURL=filterHeadersForAPIGateway.js.map