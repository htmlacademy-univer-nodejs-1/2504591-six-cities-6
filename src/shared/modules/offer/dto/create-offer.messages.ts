export const CreateOfferValidationMessage = {
  name: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  date: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalid:
      'City must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  images: {
    invalidFormat: 'Images must be an array of strings',
  },
  type: {
    invalid: 'Type must be Apartment, House, Room or Hotel',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000',
  },
  features: {
    invalidFormat: 'Field features must be an array',
    invalidId: 'Features must be valid OfferFeatureEnum values',
  },
  userId: {
    invalidId: 'userId field must be a valid MongoDB ObjectId',
  },
  coordinates: {
    invalidFormat: 'Coordinates must be an array with exactly 2 numbers',
  },
} as const;
