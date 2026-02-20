import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { MockServerData } from '../../shared/types/mock-server-data.type.js';
import { ICommand } from './command.interface.js';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { FileWriter } from '../../shared/libs/file-writer/file-writer.js';
import chalk from 'chalk';

const isMockServerData = (data: unknown): data is MockServerData =>
  typeof data === 'object' &&
  data !== null &&
  'titles' in data &&
  'descriptions' in data &&
  'cities' in data &&
  'previewImages' in data &&
  'photos' in data &&
  'types' in data &&
  'features' in data &&
  'users' in data;

export class GenerateCommand implements ICommand {
  private initialData: MockServerData;

  private async load(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!isMockServerData(data)) {
        throw new Error(`Invalid mock server data from ${url}`);
      }

      this.initialData = data;
    } catch (error) {
      throw new Error(
        `Failed to load data from url ${url}: ${getErrorMessage(error)}`
      );
    }
  }

  public getName(): string {
    return '--generate';
  }

  private async writeToFile(filepath: string, count: number): Promise<void> {
    try {
      const offerGenerator = new TSVOfferGenerator(this.initialData);
      const tsvFileWriter = new FileWriter(filepath);
      for (let i = 0; i < count; i++) {
        await tsvFileWriter.write(offerGenerator.generate());
      }
    } catch (error) {
      throw new Error(
        `Failed to write to file ${filepath}: ${getErrorMessage(error)}`
      );
    }
  }

  async execute(...parameters: string[]): Promise<void> {
    const [n, filepath, url] = parameters;
    const count = parseInt(n, 10);
    await this.load(url);
    await this.writeToFile(filepath, count);
    console.info(chalk.green(`File ${chalk.yellow(filepath)} was created!`));
  }
}
