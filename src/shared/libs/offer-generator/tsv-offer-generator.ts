import { MockServerData } from '../../types/mock-server-data.type.js';
import { IOfferGenerator } from './offer-generator.interface.js';
import {
  generateRandomInteger,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import dayjs from 'dayjs';
import { User } from '../../types/user.type.js';

const MIN_PRICE = 100;
const MAX_PRICE = 1000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const isUser = (user: unknown): user is User =>
  typeof user === 'object' &&
  user !== null &&
  'name' in user &&
  'email' in user &&
  'avatar' in user &&
  'password' in user &&
  typeof user.name === 'string' &&
  typeof user.email === 'string' &&
  typeof user.avatar === 'string' &&
  typeof user.password === 'string';

const isUserArray = (users: unknown): users is User[] =>
  Array.isArray(users) && users.every(isUser);

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    if (!isUserArray(this.mockData.users)) {
      throw new Error(
        'Invalid mock data: users should be an array of User objects'
      );
    }
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const preview = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.photos);
    const isPremium = Math.random() < 0.5;
    const isFavorite = Math.random() < 0.5;
    const rating = generateRandomInteger(1, 5, 1);
    const type = getRandomItem<string>(this.mockData.types);
    const rooms = generateRandomInteger(1, 5);
    const guests = generateRandomInteger(1, 10);
    const price = generateRandomInteger(MIN_PRICE, MAX_PRICE);
    const features = getRandomItems<string>(this.mockData.features);
    const user = getRandomItem<User>(this.mockData.users);
    const coordinates: [number, number] = [
      generateRandomInteger(0, 90, 6),
      generateRandomInteger(0, 180, 6),
    ];
    const date = dayjs()
      .subtract(generateRandomInteger(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      date,
      city,
      preview,
      images.join(';'),
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features.join(';'),
      `${user.name};${user.email};${user.avatar};${user.password}`,
      `${coordinates[0]};${coordinates[1]}`,
    ].join('\t');
  }
}
