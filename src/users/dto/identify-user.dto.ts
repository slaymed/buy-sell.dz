import { IsEmail, IsNumber, Length, Min, MinLength } from 'class-validator';

export class IdentifyUserDto {
  // @MinLength(3, { message: 'must have at least 3 char long' })
  // firstName: string;

  // @MinLength(3, { message: 'must have at least 3 char long' })
  // lastName: string;

  // @IsNumber(undefined, { message: 'must be a number' })
  // @Min(16, { message: "you're not allowed here" })
  // age: number;

  @MinLength(1, { message: 'must not be empty' })
  @IsEmail(undefined, { message: 'must be a valid email address' })
  email: string;
}
