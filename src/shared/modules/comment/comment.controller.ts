import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpMethod,
  RequestBody,
  RequestParams,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { ICommentService } from './comment-service.interface.js';
import { Request, Response } from 'express';
import { fillDTO, getId } from '../../helpers/common.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
    });
  }

  private async index(req: Request, res: Response) {
    const id = getId(req.params);
    const comments = await this.commentService.find(id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create(
    req: Request<RequestParams, RequestBody, CreateCommentDto>,
    res: Response
  ) {
    const offerId = getId(req.params);
    const dto = {
      ...req.body,
      offerId,
    };
    const result = await this.commentService.create(fillDTO(CommentRdo, dto));
    this.ok(res, result);
  }
}
