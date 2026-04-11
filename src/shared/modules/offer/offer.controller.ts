import { inject, injectable } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { Response, Request } from 'express';
import { CreateOfferDto, IOfferService } from './index.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: IOfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateOfferDto
    >,
    res: Response
  ): Promise<void> {
    const existOffer = await this.offerService.findByOfferName(body.name);

    if (existOffer) {
      const existOfferError = new Error(
        `Offer with name «${body.name}» exists.`
      );
      this.send(res, StatusCodes.UNPROCESSABLE_ENTITY, {
        error: existOfferError.message,
      });

      return this.logger.error(existOfferError.message, existOfferError);
    }

    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }
}
