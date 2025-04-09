import { utilities } from 'nest-winston';
import { config } from 'node-config-ts';
import { format, LoggerOptions, transport, transports } from 'winston';
import { LogstashTransport } from 'winston-logstash-transport';

const getLogTransport = (): transport => {
  if (config.LOGGER_CONFIG.LOG_TRANSPORT === 'logstash') {
    return new LogstashTransport({
      application: config.APP_NAME,
      port: config.LOGGER_CONFIG.LOGSTASH_PORT,
      host: config.LOGGER_CONFIG.LOGSTASH_HOST,
      format: format.combine(
        format.label({ label: config.APP_NAME }),
        format.timestamp(),
        format.errors({ stack: true }),
        format.metadata({
          key: 'metadata',
          fillExcept: ['message', 'level', 'timestamp', 'label', 'type', 'env', 'mode'],
        }),
        format.json()
      ),
    }) as unknown as transport;
  }
  return new transports.Console({
    format: format.combine(
      format.colorize(),
      format.ms(),
      utilities.format.nestLike(config.APP_NAME, {
        prettyPrint: true,
      })
    ),
  });
};

export const loggerOptions: LoggerOptions = {
  defaultMeta: {
    type: config.APP_NAME,
    env: config.NODE_ENV,
    mode: config.LOGGER_CONFIG.LOG_MODE,
  },
  transports: [getLogTransport()],
  level: config.LOGGER_CONFIG.LOG_LEVEL,
};
