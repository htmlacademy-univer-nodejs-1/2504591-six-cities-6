#!/usr/bin/env node
import 'reflect-metadata';
import {
  CLIApplication,
  HelpCommand,
  VersionCommand,
  ImportCommand,
  GenerateCommand,
} from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommand([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);
  cliApplication.processCommands(process.argv);
}

bootstrap();
