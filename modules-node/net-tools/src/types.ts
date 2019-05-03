import * as http from 'http';

export interface IIncomingMessageWithBody extends http.IncomingMessage {
    body: string,
}

export interface IRequestOptions extends http.RequestOptions {
    stdout?: NodeJS.WritableStream,
}
