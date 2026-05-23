import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { User, UserType, UserTypeEnum } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { OfferEntity } from '../offer/offer.entity.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this._password = userData.password;
    this.type = userData.type;
  }

  @prop({ required: false, default: '', type: () => String })
  public avatar: string;

  @prop({ unique: true, required: true, type: () => String })
  public email: string;

  @prop({ required: true, default: '', type: () => String })
  public name: string;

  @prop({
    required: true,
    type: () => String,
    enum: Object.values(UserTypeEnum),
  })
  public type: UserType;

  @prop({
    type: () => String,
    required: true,
    default: '',
  })
  private _password: string;

  public get password() {
    return this._password;
  }

  @prop({
    type: () => [mongoose.Schema.Types.ObjectId],
    ref: () => OfferEntity,
    _id: false,
    default: [],
  })
  public favorites: Ref<OfferEntity>[];

  public setPassword(password: string, salt: string) {
    this._password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
