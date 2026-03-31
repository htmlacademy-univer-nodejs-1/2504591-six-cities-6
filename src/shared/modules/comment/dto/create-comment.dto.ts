import { IsDateString, IsInt, IsMongoId, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  public text: string;

  @IsDateString()
  public date: string;

  @IsInt()
  public rating: number;

  @IsMongoId()
  public authorId: string;
}
