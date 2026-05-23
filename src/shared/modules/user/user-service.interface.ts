import { DocumentType, Ref } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { OfferEntity } from '../offer/offer.entity.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOneById(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>>;
  addFavorite(userId: string, offerId: string): Promise<void>;
  getFavorites(userId: string): Promise<Ref<OfferEntity>[]>;
  deleteFavorite(userId: string, offerId: string): Promise<void>;
  getFavoriteIds(userId: string): Promise<string[]>;
}
