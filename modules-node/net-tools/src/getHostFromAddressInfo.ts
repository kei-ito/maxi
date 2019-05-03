import {AddressInfo} from 'net';

export const getHostFromAddressInfo = (
    addressInfo: AddressInfo | string | null | undefined,
): string => {
    if (!addressInfo || typeof addressInfo !== 'object') {
        throw new Error(`Invalid addressInfo: ${addressInfo}`);
    }
    if (addressInfo.family.includes('v6')) {
        return `[${addressInfo.address}]:${addressInfo.port}`;
    }
    return `${addressInfo.address}:${addressInfo.port}`;
};
