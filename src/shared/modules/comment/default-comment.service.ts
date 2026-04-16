import { inject } from 'inversify';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';

const DEFAULT_COMMENT_LIMIT = 50;

export class DefaultCommentService implements ICommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = this.commentModel.create(dto);
    this.logger.info(`New comment created: ${dto.text}`);
    return result;
  }

  async find(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    this.logger.info(`Finding comments for offer ${offerId}...`);
    const comments = await this.commentModel
      .find({ offerId })
      .sort({ createdAt: -1 })
      .limit(DEFAULT_COMMENT_LIMIT)
      .exec();

    this.logger.info(`Find comments: ${comments.join()}`);
    return comments;
  }
}
