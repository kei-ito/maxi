"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommonHeaders = (event, _context, exposes = {}) => {
    const origin = event.headers.Origin || '';
    const allowedOrigin = origin.match(/http:\/\/[\w.]+:1234/) ? origin : '';
    const exposedHeaderNames = Object.keys(exposes).concat('x-elapsed-seconds', 'x-created-at');
    return Object.assign({ 'access-control-allow-origin': allowedOrigin, 'access-control-allow-methods': 'GET, OPTIONS', 'access-control-expose-headers': exposedHeaderNames.join(', ') }, exposes, { 'x-elapsed-seconds': `${process.uptime()}`, 'x-created-at': new Date().toISOString() });
};
//# sourceMappingURL=generateCommonHeaders.js.map