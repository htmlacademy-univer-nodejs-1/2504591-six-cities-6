import { ContainerModule } from 'inversify';
import { IOfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { types } from '@typegoose/typegoose';
import { OfferController } from './offer.controller.js';
import { BaseController } from '../../libs/rest/index.js';

export function createOfferContainer(): ContainerModule {
  const offerContainer = new ContainerModule(({ bind }) => {
    bind<IOfferService>(Component.OfferService)
      .to(DefaultOfferService)
      .inSingletonScope();
    bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(
      OfferModel
    );
    bind<BaseController>(Component.OfferController)
      .to(OfferController)
      .inSingletonScope();
  });
  return offerContainer;
}
