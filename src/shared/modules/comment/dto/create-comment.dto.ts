import { IsInt, IsMongoId, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  public text: string;

  @IsInt()
  public rating: number;

  @IsMongoId()
  public authorId: string;

  @IsMongoId()
  public offerId: string;
}
