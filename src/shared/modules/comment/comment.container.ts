import { ContainerModule } from 'inversify';
import { Component } from '../../types/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { types } from '@typegoose/typegoose';
import { DefaultCommentService } from './default-comment.service.js';

export function createCommentContainer(): ContainerModule {
  const commentContainer = new ContainerModule(({ bind }) => {
    bind<ICommentService>(Component.CommentService)
      .to(DefaultCommentService)
      .inSingletonScope();
    bind<types.ModelType<CommentEntity>>(
      Component.CommentModel
    ).toConstantValue(CommentModel);
  });
  return commentContainer;
}
