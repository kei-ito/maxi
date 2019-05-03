import * as stream from 'stream';

export interface IStreamReader<TResult = any> {
    (readable: stream.Readable): Promise<TResult>,
}
