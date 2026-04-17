import { RequestHandler } from 'express';
import { HttpMethod } from './http-method.enum.js';
import { IMiddleware } from '../index.js';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
  middlewares?: IMiddleware[];
}
