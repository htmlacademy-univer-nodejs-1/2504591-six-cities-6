import { inject, injectable } from 'inversify';
import { IConfig } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import express, { Express } from 'express';
import {
  IController,
  IExceptionFilter,
  ParseTokenMiddleware,
} from '../shared/libs/rest/index.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.constant.js';
import cors from 'cors';

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
    @inject(Component.UserController)
    private readonly userController: IController,
    @inject(Component.CommentController)
    private readonly commentController: IController,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: IExceptionFilter,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: IExceptionFilter,
    @inject(Component.HttpExceptionFilter)
    private readonly httpExceptionFilter: IExceptionFilter,
    @inject(Component.ValidationExceptionFilter)
    private readonly validationExceptionFilter: IExceptionFilter
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
      `Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`
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
    this.server.use('/offers', this.commentController.router);
    this.server.use('/users', this.userController.router);
  }

  public async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(
      this.config.get('JWT_SECRET')
    );

    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    this.server.use(
      authenticateMiddleware.execute.bind(authenticateMiddleware)
    );
    this.server.use(cors());
  }

  public async _initExceptionFilter() {
    this.server.use(
      this.authExceptionFilter.catch.bind(this.authExceptionFilter)
    );
    this.server.use(
      this.validationExceptionFilter.catch.bind(this.validationExceptionFilter)
    );
    this.server.use(
      this.httpExceptionFilter.catch.bind(this.httpExceptionFilter)
    );
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }
}
