import { RequestParams, RequestBody } from '../../../libs/rest/index.js';
import { Request } from 'express';
import { PostFavotiteDto } from '../dto/post-favorite.dto.js';

export type PostFavoriteRequest = Request<
  RequestParams,
  RequestBody,
  PostFavotiteDto
>;
