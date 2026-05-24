import { inject, injectable } from 'inversify';
import { IController } from './controller.interface.js';
import { ILogger } from '../../logger/index.js';
import {
  NextFunction,
  RequestHandler,
  Request,
  Response,
  Router,
} from 'express';
import { Route } from '../types/route.interface.js';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../../types/component.enum.js';
import { PathTransformer } from '../transform/path-transformer.js';

const DEFAULT_CONTENT_TYPE = 'application/json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@injectable()
export abstract class BaseController implements IController {
  private readonly _router: Router;

  @inject(Component.PathTransformer)
  private pathTranformer: PathTransformer;

  constructor(protected readonly logger: ILogger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute(route: Route): void {
    const handler = route.handler.bind(this);
    const wrapperAsyncHandler = this.asyncHandler(handler);

    const middlewareHandlers = route.middlewares?.map((item) =>
      this.asyncHandler(item.execute.bind(item))
    );

    const allHandlers = middlewareHandlers
      ? [...middlewareHandlers, wrapperAsyncHandler]
      : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    if (!isRecord(data)) {
      throw new Error('Incorrect form data');
    }
    const modifiedData = this.pathTranformer.execute(data);
    res.type(DEFAULT_CONTENT_TYPE).status(statusCode).json(modifiedData);
  }

  ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  private asyncHandler(fn: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = fn(req, res, next);

      if (result instanceof Promise) {
        result.catch(next);
      }

      return result;
    };
  }
}
