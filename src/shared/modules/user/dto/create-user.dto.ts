import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserType, UserTypeEnum } from '../../../types/index.js';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsOptional()
  @IsString()
  public avatar: string;

  @IsString()
  @Length(1, 15, { message: CreateUserMessages.password.lengthField })
  public name: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages.password.lengthField })
  public password: string;

  @IsEnum(UserTypeEnum, { message: CreateUserMessages.type.invalidFormat })
  public type: UserType;
}
