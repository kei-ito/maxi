"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCORSHeaders = (event) => {
    const origin = event.headers.Origin;
    const allowedOrigin = origin === 'http://localhost:1234' ? origin : '';
    return {
        'access-control-allow-origin': allowedOrigin,
        'access-control-allow-methods': 'GET,OPTIONS',
    };
};
//# sourceMappingURL=generateCORSHeaders.js.map