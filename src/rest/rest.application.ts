import { inject, injectable } from 'inversify';
import { IConfig } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.shema.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import express, { Express } from 'express';
import { IController, IExceptionFilter } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: IDatabaseClient,
    @inject(Component.OfferController)
    private readonly offerControler: IController,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: IExceptionFilter
  ) {
    this.server = express();
  }

  public async init() {
    this.logger.info('Initializing REST application');
    this.logger.info(`Current PORT value from env ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this._initDB();
    this.logger.info('Init database completed');

    this.logger.info('Init express server...');
    await this._initServer();
    this.logger.info(
      `Server started on http://localhost:${this.config.get('PORT')}`
    );

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers...');
    await this._intiControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    this._initExceptionFilter();
    this.logger.info('Exception filters initialization compleated');
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

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _intiControllers() {
    this.server.use('/offers', this.offerControler.router);
  }

  public async _initMiddleware() {
    this.server.use(express.json());
  }

  public async _initExceptionFilter() {
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }
}
