import { RequestHandler } from 'express';
import { HttpMethod } from './http-method.enum.js';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
}
