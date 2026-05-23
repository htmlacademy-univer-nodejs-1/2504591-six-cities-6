import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  OfferCityEnum,
  OfferCityType,
  OfferFeatureEnum,
  OfferFeatureType,
  OfferType,
  OfferTypeEnum,
} from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @IsString()
  @MinLength(10, { message: CreateOfferValidationMessage.name.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.name.maxLength })
  public name: string;

  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  @IsString()
  public description: string;

  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.date.invalidFormat }
  )
  public date: string;

  @IsEnum(OfferCityEnum, { message: 'City must be valid' })
  public city: OfferCityType;

  @IsString()
  public preview: string;

  @IsArray()
  @IsString({ each: true })
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsInt()
  @Min(1)
  @Max(5)
  public rating: number;

  @IsEnum(OfferTypeEnum, { message: CreateOfferValidationMessage.type.invalid })
  public type: OfferType;

  @IsInt()
  @Min(1)
  @Max(8)
  public rooms: number;

  @IsInt()
  @Min(1)
  @Max(10)
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(200000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.features.invalidFormat })
  @IsEnum(OfferFeatureEnum, {
    each: true,
    message: CreateOfferValidationMessage.features.invalidId,
  })
  public features: OfferFeatureType[];

  public authorId: string;

  @IsArray({ message: CreateOfferValidationMessage.coordinates.invalidFormat })
  @ArrayMinSize(2, {
    message: CreateOfferValidationMessage.coordinates.invalidFormat,
  })
  @ArrayMaxSize(2, {
    message: CreateOfferValidationMessage.coordinates.invalidFormat,
  })
  public coordinates: number[];
}
