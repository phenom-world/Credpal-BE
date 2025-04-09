/* tslint:disable */
/* eslint-disable */
declare module 'node-config-ts' {
  interface IConfig {
    APP_NAME: string;
    NODE_ENV: string;
    PORT: number;
    DATABASE_CONFIG: DATABASECONFIG;
    LOGGER_CONFIG: LOGGERCONFIG;
    JWT_CONFIG: JWTCONFIG;
  }

  interface LOGGERCONFIG {
    LOG_TRANSPORT: string;
    LOG_LEVEL: string;
    LOG_MODE: string;
    LOGSTASH_HOST: string;
    LOGSTASH_PORT: number;
  }

  interface DATABASECONFIG {
    DB_PORT: number;
    DB_HOST: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_USER: string;
  }

  interface JWTCONFIG {
    SECRET: string;
    EXPIRES_IN: string;
  }

  export const config: Config;
  export type Config = IConfig;
}
