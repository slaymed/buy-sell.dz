import { IsEmail, MinLength } from 'class-validator';

export class LocalAuthenticationDto {
  public constructor(localAuthenticationDto: LocalAuthenticationDto) {
    Object.assign(this, localAuthenticationDto);
  }

  @IsEmail(undefined, { message: 'must be a valid email address' })
  public email: string;

  @MinLength(8, { message: 'must be at least 8 Char long' })
  public password: string;
}
