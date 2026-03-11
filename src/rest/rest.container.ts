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
  });

  return container;
}
