import { RestApplication } from './rest/index.js';
import { IConfig, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { ILogger, PinoLogger } from './shared/libs/logger/index.js';
import { Container } from 'inversify';
import { Component } from './shared/types/component.enum.js';
import { MongoDatabaseClient } from './shared/libs/database-client/mongo.database-client.js';
import { IDatabaseClient } from './shared/libs/database-client/database-client.interface.js';

async function bootstrap() {
  const container = new Container();
  container
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();

  container.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();

  container
    .bind<IConfig<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();

  container
    .bind<IDatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();

  const app = container.get<RestApplication>(Component.RestApplication);
  await app.init();
}

bootstrap();
