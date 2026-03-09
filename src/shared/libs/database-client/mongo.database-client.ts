import { inject, injectable } from 'inversify';
import { IDatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import * as Mongoose from 'mongoose';
import { setTimeout } from 'node:timers/promises';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
  private mongoose: typeof Mongoose;
  private _isConnected = false;

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {}

  public get isConnected(): boolean {
    return this.isConnected === true;
  }

  public async connect(url: string): Promise<void> {
    if (this._isConnected) {
      throw new Error('MongoDB client already connected');
    }
    this.logger.info('Trying to connect to MongoDB…');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(url);
        this._isConnected = true;
      } catch (error) {
        if (error instanceof Error) {
          attempt++;
          this.logger.error(
            `Failed to connect to the database. Attempt ${attempt}`,
            error
          );
          await setTimeout(RETRY_TIMEOUT);
        }
      }
    }
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this._isConnected) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this._isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
