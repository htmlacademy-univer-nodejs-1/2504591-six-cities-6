import {
  OfferCityType,
  OfferFeatureType,
  OfferType,
  OfferTypeEmum,
  OfferCityEnum,
  OfferFeatureEnum,
} from '../types/index.js';
import { ParsedLine } from '../types/parsed-line.type.js';
import { includes } from './common.js';

const isCoordinatesValid = (
  coordinates: unknown
): coordinates is [number, number] =>
  Array.isArray(coordinates) &&
  coordinates.length === 2 &&
  typeof coordinates[0] === 'number' &&
  typeof coordinates[1] === 'number' &&
  !isNaN(coordinates[0]) &&
  !isNaN(coordinates[1]);

const isOfferType = (type: string): type is OfferType =>
  includes(Object.values(OfferTypeEmum), type);

const isOfferCityType = (city: string): city is OfferCityType =>
  includes(Object.values(OfferCityEnum), city);

const isOfferFeatureType = (feature: string): feature is OfferFeatureType =>
  includes(Object.values(OfferFeatureEnum), feature);

export const createOffer = (line: string): ParsedLine => {
  const [
    name,
    description,
    date,
    city,
    preview,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    guests,
    price,
    features,
    userInfo,
    coordinates,
  ] = line.split('\t');

  const [userName, userEmail, userAvatar, userPassword, userType] =
    userInfo.split(';');

  const coord = coordinates.split(';').map(Number);
  const featuresArray = features.split(';');

  if (!isCoordinatesValid(coord)) {
    throw new Error(`Invalid coordinates: ${coordinates}`);
  }

  if (!isOfferType(type)) {
    throw new Error(`Invalid offer type: ${type}`);
  }

  if (!isOfferCityType(city)) {
    throw new Error(`Invalid city: ${city}`);
  }

  if (!featuresArray.every(isOfferFeatureType)) {
    const invalid = featuresArray.filter((f) => !isOfferFeatureType(f));
    throw new Error(`Invalid features: ${invalid.join(', ')}`);
  }

  return {
    offer: {
      name,
      description,
      date: new Date(date),
      city,
      preview,
      images: images.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number(rating),
      type,
      rooms: Number(rooms),
      guests: Number(guests),
      price: Number(price),
      features: featuresArray,
      coordinates: coord,
    },
    user: {
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      password: userPassword,
      type: userType,
    },
  };
};
