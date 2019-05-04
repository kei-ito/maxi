import {promises as afs} from 'fs';
import {IObjectCatalog} from '../src/types';
import {catalogPath} from './constants';
import {stringifyCatalog} from './stringifyCatalog';

export const writeCatalog = async (
    catalog: IObjectCatalog | null,
): Promise<void> => {
    if (catalog) {
        await afs.writeFile(catalogPath, stringifyCatalog(catalog));
    }
};
