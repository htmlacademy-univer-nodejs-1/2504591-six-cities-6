import { ContainerModule } from 'inversify';
import { IUserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.js';
import { BaseController } from '../../libs/rest/index.js';
import { UserController } from './user.controller.js';

export function createUserContainer(): ContainerModule {
  const userContainer = new ContainerModule(({ bind }) => {
    bind<IUserService>(Component.UserService)
      .to(DefaultUserService)
      .inSingletonScope();
    bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(
      UserModel
    );
    bind<BaseController>(Component.UserController)
      .to(UserController)
      .inSingletonScope();
  });

  return userContainer;
}
