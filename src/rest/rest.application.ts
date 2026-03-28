import { inject, injectable } from 'inversify';
import { IConfig } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.shema.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: IDatabaseClient
  ) {}

  public async init() {
    this.logger.info('Initializing REST application');
    this.logger.info(`Current PORT value from env ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this._initDB();
    this.logger.info('Init database completed');
  }

  private async _initDB() {
    const mongoUrl = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );
    this.logger.info(`!!! GENERATED URL: ${mongoUrl} !!!`);

    return this.databaseClient.connect(mongoUrl);
  }
}
