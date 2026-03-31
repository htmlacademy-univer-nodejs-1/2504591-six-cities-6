import { Container } from 'inversify';
import {
  createRestApplicationContainer,
  RestApplication,
} from './rest/index.js';
import { Component } from './shared/types/component.enum.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(createRestApplicationContainer());
  appContainer.load(createUserContainer());
  appContainer.load(createOfferContainer());
  appContainer.load(createCommentContainer());
  const app = appContainer.get<RestApplication>(Component.RestApplication);
  await app.init();
}

bootstrap();
