import * as stream from 'stream';
import {IStreamReader} from './types';

export const asBuffer: IStreamReader<Buffer> = (
    readableStream,
) => new Promise((resolve, reject) => {
    const receivedChunks: Array<Buffer> = [];
    let sizeOfResultInBytes = 0;
    const writableStream = new stream.Writable({
        write(chunk: Buffer, _encoding, callback) {
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

export const asString: IStreamReader<string> = async (
    readableStream,
) => {
    const buffer = await asBuffer(readableStream);
    return buffer.toString('utf8');
};
