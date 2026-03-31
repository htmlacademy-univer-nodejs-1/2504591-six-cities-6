import { IsEmail, IsEnum, IsString, IsUrl } from 'class-validator';
import { UserTypeEnum } from '../../../types';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsUrl()
  public avatar: string;

  @IsString()
  public name: string;

  @IsString()
  public password: string;

  @IsEnum(UserTypeEnum)
  public type: string;
}
