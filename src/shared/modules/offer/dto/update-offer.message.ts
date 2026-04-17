export const UpdateOfferMessages = {
  name: {
    invalidFormat: 'name must be a string',
    minLength: 'Minimum name length is 10',
    maxLength: 'Maximum name length is 100',
  },
  description: {
    invalidFormat: 'description must be a string',
    minLength: 'Minimum description length is 20',
    maxLength: 'Maximum description length is 1024',
  },
  date: {
    invalidFormat: 'date must be a valid ISO date string',
  },
  city: {
    invalid:
      'city must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  preview: {
    invalidFormat: 'preview must be a string',
  },
  images: {
    invalidFormat: 'images must be an array of strings',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be a boolean',
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    min: 'Minimum rating is 1',
    max: 'Maximum rating is 5',
  },
  type: {
    invalid: 'type must be one of: Apartment, House, Room, Hotel',
  },
  rooms: {
    invalidFormat: 'rooms must be an integer',
    min: 'Minimum rooms is 1',
    max: 'Maximum rooms is 8',
  },
  guests: {
    invalidFormat: 'guests must be an integer',
    min: 'Minimum guests is 1',
    max: 'Maximum guests is 10',
  },
  price: {
    invalidFormat: 'price must be an integer',
    min: 'Minimum price is 100',
    max: 'Maximum price is 200000',
  },
  features: {
    invalidFormat: 'features must be an array',
    invalidId: 'each feature must be a valid OfferFeatureEnum value',
  },
  authorId: {
    invalidId: 'authorId must be a valid MongoDB ObjectId',
  },
  coordinates: {
    invalidFormat: 'coordinates must be an array',
    arraySize: 'coordinates must contain exactly 2 numbers',
  },
} as const;
