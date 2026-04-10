import chalk from 'chalk';
import { TsvFileReader } from '../../shared/libs/file-reader/index.js';
import { ICommand } from './command.interface.js';
import {
  createOffer,
  getErrorMessage,
  getMongoURI,
} from '../../shared/helpers/index.js';
import { IDatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { ILogger } from '../../shared/libs/logger/logger.interface.js';
import { IOfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { DEFAULT_DB_PORT } from './command.constant.js';
import {
  DefaultUserService,
  UserModel,
} from '../../shared/modules/user/index.js';
import { IUserService } from '../../shared/modules/user/user-service.interface.js';
import { ParsedLine } from '../../shared/types/parsed-line.type.js';

export class ImportCommand implements ICommand {
  private offerService: IOfferService;
  private databaseClient: IDatabaseClient;
  private userService: IUserService;
  private logger: ILogger;
  private salt: string;

  constructor() {
    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.salt = process.env.SALT ?? 'default-salt';
  }

  public getName(): string {
    return '--import';
  }

  private async saveOffer({ offer, user }: ParsedLine): Promise<void> {
    const existingUser = await this.userService.findByEmail(user.email);
    const dbUser =
      existingUser ??
      (await this.userService.create(
        {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          password: user.password,
          type: user.type,
        },
        this.salt
      ));
    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      date: offer.date.toISOString(),
      city: offer.city,
      preview: offer.preview,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      rooms: offer.rooms,
      guests: offer.guests,
      price: offer.price,
      features: offer.features,
      authorId: dbUser.id,
      coordinates: offer.coordinates,
    });
  }

  private async onImportedLine(line: string): Promise<void> {
    try {
      const parsed = createOffer(line);
      await this.saveOffer(parsed);
    } catch (err) {
      console.error(`Import failed on line: ${line}`, err);
    }
  }

  public async onImportEnd(totalLines: number): Promise<void> {
    console.info(
      chalk.green(
        `Import completed successfully! Total lines: ${chalk.yellow(totalLines)}`
      )
    );
    await this.databaseClient.disconnect();
  }

  public async execute(
    filePath: string,
    login: string,
    password: string,
    host: string,
    dbname: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

    await this.databaseClient.connect(uri);
    const fileReader = new TsvFileReader(filePath.trim());

    fileReader.on('line', async (line, resolve) => {
      await this.onImportedLine(line);
      resolve();
    });
    fileReader.on('end', (totalLines) => this.onImportEnd(totalLines));

    try {
      await fileReader.read();
    } catch (error) {
      console.error(chalk.red(`Error reading file: ${getErrorMessage(error)}`));
    }
  }
}
