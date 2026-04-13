import { RequestParams, RequestBody } from '../../../libs/rest';
import { Request } from 'express';
import { CreateOfferDto } from '../dto/create-offer.dto.js';

export type CreateOfferRequest = Request<
  RequestParams,
  RequestBody,
  CreateOfferDto
>;
