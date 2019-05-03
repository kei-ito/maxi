import {Server} from 'net';

const allowedErrorCodes = new Set([
    'EADDRINUSE',
    'EADDRNOTAVAIL',
]);

export const listen = (
    server: Server,
    port: number = 3000,
): Promise<Server> => new Promise((resolve, reject) => {
    const onError = (error: Error & {code: string}) => {
        removeListeners();
        if (allowedErrorCodes.has(error.code) && port < 0x10000) {
            resolve(listen(server, port + 1));
        } else {
            reject(error);
        }
    };
    const onListening = () => {
        removeListeners();
        resolve(server);
    };
    const removeListeners = () => {
        server.removeListener('error', onError);
        server.removeListener('listening', onListening);
    };
    server
    .once('error', onError)
    .once('listening', onListening)
    .listen(port);
});
