import chalk from 'chalk';
import { ICommand } from './command.interface.js';

export class HelpCommand implements ICommand {
  public getName(): string {
    return '--help';
  }

  public execute(..._parameters: string[]): void {
    console.info(
      chalk.magenta(
        `Available commands:
  --help: Show this help message
  --version: Show the current version of the application
  --import <path>: Import data from the specified file path
  --generate <n> <filepath> <url>: Generate n offers and save to the specified file path,
    using data from the specified URL
      `
      )
    );
  }
}
