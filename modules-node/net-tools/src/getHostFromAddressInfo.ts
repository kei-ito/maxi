import {AddressInfo} from 'net';

export const getHostFromAddressInfo = (
    addressInfo: AddressInfo | string | null | undefined,
): string => {
    if (!addressInfo || typeof addressInfo !== 'object') {
        throw new Error(`Invalid addressInfo: ${addressInfo}`);
    }
    let {address} = addressInfo;
    if (address === '::') {
        address = '::1';
    }
    if (addressInfo.family.includes('v6')) {
        return `[${address}]:${addressInfo.port}`;
    }
    return `${address}:${addressInfo.port}`;
};
