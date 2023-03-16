import { IsEmail } from 'class-validator';

export class GoogleAuthPayloadDto {
  public constructor(googleAuthPayloadDto: GoogleAuthPayloadDto) {
    Object.assign(this, googleAuthPayloadDto);
  }

  @IsEmail(undefined, { message: 'must be a valid email address' })
  public email: string;
}
