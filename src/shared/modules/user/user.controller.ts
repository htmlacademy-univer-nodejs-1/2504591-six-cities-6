import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './requests/create-user-request.type.js';
import { Response } from 'express';
import { IUserService } from './user-service.interface.js';
import { IConfig, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './requests/login-user-request.type.js';
import { LogoutUserRequest } from './requests/logout-user-request.type.js';
import { RefreshUserRequest } from './requests/refresh-user-request.type.js';
import { MeUserRequest } from './requests/me-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
    });

    this.addRoute({
      path: '/refresh',
      method: HttpMethod.Post,
      handler: this.refresh,
    });

    this.addRoute({
      path: '/me',
      method: HttpMethod.Get,
      handler: this.me,
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);
    if (!existUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController'
      );
    }

    this.ok(res, { token: String(existUser._id) });
  }

  public async logout(
    { body }: LogoutUserRequest,
    res: Response
  ): Promise<void> {
    this.noContent(res, { body });
  }

  public async refresh(
    { body }: RefreshUserRequest,
    res: Response
  ): Promise<void> {
    this.ok(res, body.token);
  }

  public async me({ body }: MeUserRequest, res: Response): Promise<void> {
    this.ok(res, { body });
  }
}
