import winston, { createLogger, format, transports, Logger as WinstonLogger } from 'winston';


class Logger {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: process.env.NODE_ENV?.toLowerCase() === "dev" ? "debug" : "info",
      format: this.getLogFormat(),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'app.log' }),
        new transports.Console({ format: this.getLogFormat() })
      ]
    });

  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public debug(message: string): void {
    const isDebug = process.env.DEBUG?.toLowerCase() === "true";
    if (!isDebug) return;
    this.logger.debug(message);
  }

  public logObject(level: 'info' | 'warn' | 'error' | 'debug', message: string, obj: any): void {
    this.logger.log(level, `${message} - ${JSON.stringify(obj)}`);
  }

  private getLogFormat(): winston.Logform.Format {
    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => `[${level.toUpperCase()}] [${timestamp}]: ${message}`),
    );
    return logFormat;
  }
}

export default new Logger();