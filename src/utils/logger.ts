import path from 'path';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import { FileTransportInstance } from 'winston/lib/winston/transports';

type CreateTransportFileParams = {
    maxsize?: number;
    maxFiles?: number;
    filename: string;
    level: string;
}

class Logger {
  private logger: WinstonLogger;

  constructor() {
    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    );

    this.logger = createLogger({
      level: 'info',
      format: logFormat,
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            logFormat
          )
        }),
        this.createTransportsFile({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
        }),
        this.createTransportsFile({
            filename: path.join(__dirname, '../../logs/info.log'),
            level: 'info',
        })
      ],
      exitOnError: false,
    });

  }

  private createTransportsFile({ maxsize = 5242880, maxFiles = 5, filename, level }: CreateTransportFileParams): FileTransportInstance {
    return new transports.File({
        filename,
        level,
        handleExceptions: true,
        maxsize,
        maxFiles
    })
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
}

export default new Logger();