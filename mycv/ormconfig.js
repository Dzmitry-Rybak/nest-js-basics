const dbConfig = {
    synchronize: false,
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js'],
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true, // run migration for each individual test
        });
        break;
    case 'production':
        Object.assign(dbConfig, {
            type: 'potgres',
            url: process.env.DATABASE_URL,
            entities: ['**/*.entity.js'],
            migrationsRun: true,
        });
        break;
        break;
    default:
        throw new Error('unknown enviroment');
}

module.exports = dbConfig;
