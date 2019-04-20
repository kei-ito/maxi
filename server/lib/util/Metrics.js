"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetrics = (createdAt = process.uptime()) => ({
    createdAt,
    processCount: 0,
    processMap: new WeakMap(),
});
const metrics = exports.createMetrics();
exports.createProcessMetrics = (process, createdAt = process.uptime()) => ({
    createdAt,
    functionCount: 0,
    functionMap: new WeakMap(),
});
exports.createFunctionMetrics = (createdAt = process.uptime()) => ({
    createdAt,
    startedAt: null,
    endedAt: null,
    httpRequests: [],
    httpRequestMap: new WeakMap(),
});
exports.createHTTPRequestMetrics = (createdAt = process.uptime()) => ({
    createdAt,
    startedAt: null,
    endedAt: null,
    respondedAt: null,
    finishedAt: null,
});
class Metrics {
    onStarted() {
        this.startedAt = process.uptime();
    }
    onEnded() {
        this.endedAt = process.uptime();
    }
    onHTTPRequestCreated(request) {
        this.setHTTPRequestMetrics(request, 'startedAt');
    }
    onHTTPRequestEnded(request) {
        this.setHTTPRequestMetrics(request, 'endedAt');
    }
    onHTTPRequestResponded(request) {
        this.setHTTPRequestMetrics(request, 'respondedAt');
    }
    onHTTPRequestFinished(request) {
        this.setHTTPRequestMetrics(request, 'finishedAt');
    }
    getHTTPRequestMetrics(request) {
        let requestMetrics = this.httpRequestMap.get(request);
        if (!requestMetrics) {
            requestMetrics = exports.createHTTPRequestMetrics();
            this.httpRequestMap.set(request, requestMetrics);
        }
        return requestMetrics;
    }
    setHTTPRequestMetrics(request, key) {
        this.getHTTPRequestMetrics(request)[key] = process.uptime();
    }
}
exports.Metrics = Metrics;
//# sourceMappingURL=Metrics.js.map