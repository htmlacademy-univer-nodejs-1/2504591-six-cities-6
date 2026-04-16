import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import {
  OfferCityEnum,
  OfferTypeEnum,
  OfferFeatureEnum,
  OfferFeatureType,
  OfferType,
  OfferCityType,
} from '../../../types/index.js';
import { UpdateOfferMessages } from './update-offer.message.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: UpdateOfferMessages.name.invalidFormat })
  @MinLength(10, { message: UpdateOfferMessages.name.minLength })
  @MaxLength(100, { message: UpdateOfferMessages.name.maxLength })
  public name?: string;

  @IsOptional()
  @IsString({ message: UpdateOfferMessages.description.invalidFormat })
  @MinLength(20, { message: UpdateOfferMessages.description.minLength })
  @MaxLength(1024, { message: UpdateOfferMessages.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: UpdateOfferMessages.date.invalidFormat })
  public date?: string;

  @IsOptional()
  @IsEnum(OfferCityEnum, { message: UpdateOfferMessages.city.invalid })
  public city?: OfferCityType;

  @IsOptional()
  @IsString({ message: UpdateOfferMessages.preview.invalidFormat })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.images.invalidFormat })
  @IsString({ each: true })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferMessages.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: UpdateOfferMessages.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.rating.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.rating.min })
  @Max(5, { message: UpdateOfferMessages.rating.max })
  public rating?: number;

  @IsOptional()
  @IsEnum(OfferTypeEnum, { message: UpdateOfferMessages.type.invalid })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.rooms.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.rooms.min })
  @Max(8, { message: UpdateOfferMessages.rooms.max })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.guests.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.guests.min })
  @Max(10, { message: UpdateOfferMessages.guests.max })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.price.invalidFormat })
  @Min(100, { message: UpdateOfferMessages.price.min })
  @Max(200000, { message: UpdateOfferMessages.price.max })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.features.invalidFormat })
  @IsEnum(OfferFeatureEnum, {
    each: true,
    message: UpdateOfferMessages.features.invalidId,
  })
  public features?: OfferFeatureType[];

  @IsOptional()
  @IsMongoId({ message: UpdateOfferMessages.authorId.invalidId })
  public authorId?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.coordinates.invalidFormat })
  @ArrayMinSize(2, { message: UpdateOfferMessages.coordinates.arraySize })
  @ArrayMaxSize(2, { message: UpdateOfferMessages.coordinates.arraySize })
  public coordinates?: number[];
}
