import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite')); // remove test.sqlite file from our ../ directory
    } catch (error) {} // try/cath - just because if file dosn't exist we can get an error, but with this empty catch scope, we don't throw an error
});
