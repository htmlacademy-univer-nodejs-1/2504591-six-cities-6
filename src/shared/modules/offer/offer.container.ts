import { ContainerModule } from 'inversify';
import { IOfferService } from './offer-service.interface.js';
import { Component } from '../../types';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { types } from '@typegoose/typegoose';

export function createOfferContainer(): ContainerModule {
  const offerContainer = new ContainerModule(({ bind }) => {
    bind<IOfferService>(Component.OfferService)
      .to(DefaultOfferService)
      .inSingletonScope();
    bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(
      OfferModel
    );
  });
  return offerContainer;
}
