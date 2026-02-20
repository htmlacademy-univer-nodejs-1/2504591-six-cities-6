import { resolve } from 'node:path';
import { ICommand } from './command.interface.js';
import { readFileSync } from 'node:fs';
import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/index.js';

type PackageJSONConfig = {
  version: string;
};

const isPackageJSONConfig = (data: unknown): data is PackageJSONConfig =>
  typeof data === 'object' &&
  data !== null &&
  !Array.isArray(data) &&
  Object.hasOwn(data, 'version');

export class VersionCommand implements ICommand {
  constructor(private readonly filePath = './package.json') {}

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.log(`Current version: ${chalk.green(version)}`);
    } catch (error) {
      console.error(
        chalk.redBright(`Error reading version: ${getErrorMessage(error)}`)
      );
    }
  }

  private readVersion(): string {
    const jsonData = readFileSync(resolve(this.filePath), 'utf-8');
    const jsonParse: unknown | null = JSON.parse(jsonData);
    if (!jsonParse || !isPackageJSONConfig(jsonParse)) {
      throw new Error('Version not found in package.json');
    }
    return jsonParse.version;
  }
}
