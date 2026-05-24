import { ContainerModule } from 'inversify';
import {
  IConfig,
  RestSchema,
  RestConfig,
} from '../shared/libs/config/index.js';
import {
  IDatabaseClient,
  MongoDatabaseClient,
} from '../shared/libs/database-client/index.js';
import { ILogger, PinoLogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/index.js';
import { RestApplication } from './rest.application.js';
import {
  AppExceptionFilter,
  HttpErrorExceptionFilter,
  IExceptionFilter,
  PathTransformer,
  ValidationExceptionFilter,
} from '../shared/libs/rest/index.js';

export function createRestApplicationContainer(): ContainerModule {
  const container = new ContainerModule(({ bind }) => {
    bind<RestApplication>(Component.RestApplication)
      .to(RestApplication)
      .inSingletonScope();
    bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
    bind<IConfig<RestSchema>>(Component.Config)
      .to(RestConfig)
      .inSingletonScope();
    bind<IDatabaseClient>(Component.DatabaseClient)
      .to(MongoDatabaseClient)
      .inSingletonScope();
    bind<IExceptionFilter>(Component.ExceptionFilter)
      .to(AppExceptionFilter)
      .inSingletonScope();
    bind<IExceptionFilter>(Component.HttpExceptionFilter)
      .to(HttpErrorExceptionFilter)
      .inSingletonScope();
    bind<IExceptionFilter>(Component.ValidationExceptionFilter)
      .to(ValidationExceptionFilter)
      .inSingletonScope();

    bind<PathTransformer>(Component.PathTransformer)
      .to(PathTransformer)
      .inSingletonScope();
  });

  return container;
}
