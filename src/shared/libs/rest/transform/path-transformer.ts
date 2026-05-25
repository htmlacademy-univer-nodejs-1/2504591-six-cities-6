import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { ILogger } from '../../logger/logger.interface.js';
import { IConfig } from '../../config/config.interface.js';
import { RestSchema } from '../../config/rest.schema.js';
import {
  DEFAULT_STATIC_IMAGES,
  STATIC_RESOURCE_FIELDS,
} from './path-transformer.constant.js';
import {
  STATIC_FILES_ROUTE,
  STATIC_UPLOAD_ROUTE,
} from '../../../../rest/index.js';
import { getFullServerPath, isObject } from '../../../helpers/index.js';

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>
  ) {
    this.logger.info('PathTranformer created!');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {
            const staticPath = STATIC_FILES_ROUTE;
            const uploadPath = STATIC_UPLOAD_ROUTE;
            const serverHost = this.config.get('HOST');
            const serverPort = this.config.get('PORT');

            const rootPath = this.hasDefaultImage(value)
              ? staticPath
              : uploadPath;
            current[key] =
              `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
          }
        }
      }
    }

    return data;
  }
}
