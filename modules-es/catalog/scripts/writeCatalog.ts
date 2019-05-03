import {promises as afs} from 'fs';
import {IObjectCatalog} from '../src/types';
import {catalogPath} from './constants';
import {stringifyCatalog} from './stringifyCatalog';

export const writeCatalog = async (
    catalog: IObjectCatalog,
): Promise<void> => {
    await afs.writeFile(catalogPath, stringifyCatalog(catalog));
};
