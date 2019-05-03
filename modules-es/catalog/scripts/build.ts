import * as util from 'util';
import {buildCatalog} from './buildCatalog';
import {writeCatalog} from './writeCatalog';

if (!module.parent) {
    buildCatalog(process.stdout)
    .then(writeCatalog)
    .catch((error) => {
        process.stderr.write(util.inspect(error));
        process.exit(1);
    });
}
