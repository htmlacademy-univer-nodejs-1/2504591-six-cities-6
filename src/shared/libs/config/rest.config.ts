import { config } from 'dotenv';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface';
import { configRestSchema, RestSchema } from './rest.shema.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly restConfig: RestSchema;
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const configOutput = config();
    if (configOutput.error || !configOutput.parsed) {
      throw new Error('Failed to parse .env file');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.restConfig = configRestSchema.getProperties();
    this.logger.info('Configuration loaded successfully');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.restConfig[key];
  }
}
