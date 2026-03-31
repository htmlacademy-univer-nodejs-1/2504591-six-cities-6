import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DeleteResult } from 'mongoose';

export interface IOfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findByOfferName(offerName: string): Promise<DocumentType<OfferEntity> | null>;
  findByOfferNameOrCreate(
    offerName: string,
    dto: CreateOfferDto
  ): Promise<DocumentType<OfferEntity>>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DeleteResult>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorite(offerId: string, userId: string): Promise<void>;
  deleteFromFavorite(offerId: string, userId: string): Promise<void>;
  incCommentCount(offerId: string): Promise<void>;
  recalculateRating(offerId: string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
}
