import { IUserService } from './user-service.interface.js';
import { DocumentType, Ref, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/index.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@injectable()
export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async updateById(
    id: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOneAndUpdate({ _id: id }, dto, {
      returnDocument: 'after',
    });
  }

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, avatar: DEFAULT_AVATAR_FILE_NAME });
    user.setPassword(dto.password, salt);

    const res = this.userModel.create(user);
    this.logger.info(`New user created: ${user.name}`);
    return res as Promise<DocumentType<UserEntity>>;
  }

  public findOneById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ _id: id });
  }

  public findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }
    return this.create(dto, salt);
  }

  public async addFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favorites: offerId },
    });
  }

  public async getFavorites(userId: string): Promise<Ref<OfferEntity>[]> {
    const existedUser = await this.findOneById(userId);
    if (existedUser) {
      await existedUser.populate('favorites');
    }
    return existedUser?.favorites || [];
  }

  public async getFavoriteIds(userId: string): Promise<string[]> {
    const user = await this.findOneById(userId);
    if (!user || !user.favorites) {
      return [];
    }
    this.logger.info(user.favorites.toString());
    return [...user.favorites].map((favorite) => favorite.toString());
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { favorites: offerId },
    });
  }
}
