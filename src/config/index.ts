import { config } from 'node-config-ts';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const isProd: boolean = config.NODE_ENV === 'production';
export const isDev: boolean = config.NODE_ENV === 'development';
export const appPort: number = config.PORT;

export const getTypeOrmConfig = (): DataSourceOptions => {
  return {
    type: 'mysql',
    host: config.DATABASE_CONFIG.DB_HOST,
    port: config.DATABASE_CONFIG.DB_PORT,
    username: config.DATABASE_CONFIG.DB_USER,
    password: config.DATABASE_CONFIG.DB_PASSWORD,
    database: config.DATABASE_CONFIG.DB_NAME,
    synchronize: false,
    entities: [join(__dirname, '..', 'modules/**/entities/*.entity.{ts,js}')],
    migrations: [join(__dirname, '../', 'migrations/*.{ts,js}')],
    migrationsTransactionMode: 'each',
    migrationsTableName: 'migrations',
    ssl: false,
    migrationsRun: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
};
