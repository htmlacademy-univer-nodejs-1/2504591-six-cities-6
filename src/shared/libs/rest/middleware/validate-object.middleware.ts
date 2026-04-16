import { Request, Response, NextFunction } from 'express';
import { HttpError, IMiddleware } from '../index.js';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

export class ValidateObjectIdMiddleware implements IMiddleware {
  constructor(private param: string) {}

  execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (typeof objectId === 'string' && Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
