"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream = require("stream");
exports.asBuffer = (readableStream) => new Promise((resolve, reject) => {
    const receivedChunks = [];
    let sizeOfResultInBytes = 0;
    const writableStream = new stream.Writable({
        write(chunk, _encoding, callback) {
            receivedChunks.push(chunk);
            sizeOfResultInBytes += chunk.length;
            callback();
        },
        final(callback) {
            const concatenatedBuffer = Buffer.concat(receivedChunks, sizeOfResultInBytes);
            resolve(concatenatedBuffer);
            callback();
        },
    });
    writableStream.once('error', reject);
    readableStream.pipe(writableStream);
});
exports.asString = async (readableStream) => {
    const buffer = await exports.asBuffer(readableStream);
    return buffer.toString('utf8');
};
//# sourceMappingURL=streamReader.js.map