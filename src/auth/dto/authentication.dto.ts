import { IsEmail, IsEnum, MinLength } from 'class-validator';
import { UserType } from '../../users/enums';

export class AuthenticationDto {
  @IsEmail(undefined, { message: 'must be a valid email address' })
  @MinLength(1, { message: 'must not be empty' })
  email: string;

  @MinLength(8, { message: 'must be at least 8 char long' })
  password: string;

  @IsEnum(UserType, { message: `Must be one value of ${UserType}` })
  from: UserType;
}
