import { validate } from 'class-validator';
import { ExceptionFactory } from './exception-factory';

export class ParamsValidator {
  public static async validate(
    object: object,
  ): Promise<{ [key: string]: string }> {
    const errors = await validate(object);

    if (errors.length > 0) {
      const mappedErrors = new ExceptionFactory().map(errors);
      return Object.keys(mappedErrors).length > 0 ? mappedErrors : null;
    }
  }
}
