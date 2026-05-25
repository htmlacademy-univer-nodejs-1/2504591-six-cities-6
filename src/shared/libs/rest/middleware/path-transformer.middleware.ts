import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface.js';
import { PathTransformer } from '../transform/path-transformer.js';
import { isObject } from '../../../helpers/common.js';

export class PathTransformerMiddleware implements IMiddleware {
  constructor(private readonly pathTransformer: PathTransformer) {}

  public async execute(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const originalJson = res.json.bind(res);
    const transformer = this.pathTransformer;
    res.json = function (data: unknown) {
      if (isObject(data)) {
        return originalJson(transformer.execute(data));
      }
      return originalJson(data);
    };

    next();
  }
}
