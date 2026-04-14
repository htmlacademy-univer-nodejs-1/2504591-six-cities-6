import { Expose } from 'class-transformer';
import { OfferCityType, OfferFeatureType } from '../../../types/index.js';
export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public city: OfferCityType;

  @Expose()
  public price: number;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: string;

  @Expose()
  public image: string;

  @Expose()
  public rooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public features: OfferFeatureType[];

  @Expose()
  public authorId: string;

  @Expose()
  public coordinates: number[];
}
