import { ContainerModule } from 'inversify';
import { IAuthService } from './auth-service.interface';
import { Component } from '../../types';
import { DefaultAuthService } from './default-auth.service';
import { IExceptionFilter } from '../../libs/rest';
import { AuthExceptionFilter } from './auth.exception-filter';

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
