import { ContainerModule } from 'inversify';
import { IAuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultAuthService } from './default-auth.service.js';
import { IExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';

export function createAuthContainer(): ContainerModule {
  const authContainer = new ContainerModule(({ bind }) => {
    bind<IAuthService>(Component.AuthService)
      .to(DefaultAuthService)
      .inSingletonScope();

    bind<IExceptionFilter>(Component.AuthExceptionFilter)
      .to(AuthExceptionFilter)
      .inSingletonScope();
  });

  return authContainer;
}
