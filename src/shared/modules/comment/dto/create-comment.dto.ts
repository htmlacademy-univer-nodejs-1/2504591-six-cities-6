import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CreateCommentMessage } from './create-comment.message.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessage.text.invalidFormat })
  @Length(5, 1024, { message: CreateCommentMessage.text.lengthField })
  public text: string;

  @IsInt()
  @Min(1)
  @Max(5)
  public rating: number;

  public authorId: string;

  @IsMongoId({ message: CreateCommentMessage.offerId.invalidFormat })
  public offerId: string;
}
