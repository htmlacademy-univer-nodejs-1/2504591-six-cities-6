import { Request, Response, NextFunction } from 'express';
import { BaseUserException, IExceptionFilter } from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';

@injectable()
export class AuthExceptionFilter implements IExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: ILogger) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json({ type: 'AUTHORIZATION', error: error.message });
  }
}
