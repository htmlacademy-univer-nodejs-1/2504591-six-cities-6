import { ContainerModule } from 'inversify';
import { Component } from '../../types/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { types } from '@typegoose/typegoose';
import { DefaultCommentService } from './default-comment.service.js';
import { BaseController } from '../../libs/rest/index.js';
import { CommentController } from './comment.controller.js';

export function createCommentContainer(): ContainerModule {
  const commentContainer = new ContainerModule(({ bind }) => {
    bind<ICommentService>(Component.CommentService)
      .to(DefaultCommentService)
      .inSingletonScope();
    bind<types.ModelType<CommentEntity>>(
      Component.CommentModel
    ).toConstantValue(CommentModel);
    bind<BaseController>(Component.CommentController)
      .to(CommentController)
      .inSingletonScope();
  });
  return commentContainer;
}
