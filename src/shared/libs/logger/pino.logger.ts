import { Logger } from './logger.interface.js';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { getCurrentModuleDirrectoryPath } from '../../helpers/index.js';
import { resolve } from 'node:path';
import { injectable } from 'inversify';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirrectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const mutliTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug',
        },
        {
          target: 'pino/file',
          options: {},
          level: 'info',
        },
      ],
    });

    this.logger = pino({}, mutliTransport);
    this.logger.info('Logger created!');
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info({ args }, message);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn({ args }, message);
  }

  error(message: string, err: Error, ...args: unknown[]): void {
    this.logger.error({ err, args }, message);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug({ args }, message);
  }
}
