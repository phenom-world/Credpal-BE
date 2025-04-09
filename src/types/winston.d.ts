declare module 'winston-logstash-transport' {
  interface LogstashTransportOptions {
    application: string;
    host: string;
    port: number;
    format: any;
  }

  export class LogstashTransport {
    constructor(options: LogstashTransportOptions);
  }
}
