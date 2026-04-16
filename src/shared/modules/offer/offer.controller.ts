import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { Response, Request } from 'express';
import { CreateOfferDto, IOfferService, UpdateOfferDto } from './index.js';
import { fillDTO, getId } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { CreateOfferRequest } from './requests/create-offer-request.type.js';
import { PatchOfferRequest } from './requests/patch-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.patch,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const existOffer = await this.offerService.findByOfferName(body.name);

    if (existOffer) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Offer with name «${body.name}» exists.`,
        'OfferController'
      );
    }

    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show(req: Request, res: Response): Promise<void> {
    this.logger.info('req.params:', req.params);
    this.logger.info('req.url:', req.url);
    const id = getId(req.params);
    const existOffer = await this.offerService.findByOfferId(id);
    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${id}» not found.`,
        'OfferController'
      );
    }
    const offer = await this.offerService.findByOfferId(id);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async patch(req: PatchOfferRequest, res: Response): Promise<void> {
    const id = getId(req.params);

    const existOffer = await this.offerService.findByOfferId(id);
    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${id}» not found.`,
        'OfferController'
      );
    }

    const result = await this.offerService.updateById(id, req.body);
    const responseData = fillDTO(OfferRdo, result);

    this.ok(res, responseData);
  }

  public async delete(req: PatchOfferRequest, res: Response): Promise<void> {
    const id = getId(req.params);
    const existOffer = await this.offerService.findByOfferId(id);
    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${id}» not found.`,
        'OfferController'
      );
    }
    const result = await this.offerService.deleteById(id);
    this.ok(res, result);
  }
}
