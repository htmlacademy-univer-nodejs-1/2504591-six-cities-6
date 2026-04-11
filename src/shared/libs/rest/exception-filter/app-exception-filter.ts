import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './exception-filter.interface.js';
import { Component } from '../../../types/component.enum.js';
import { ILogger } from '../../logger/logger.interface.js';
import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class AppExpectionFilter implements IExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: ILogger) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}
