import { ValidationError } from 'class-validator';

export class ExceptionFactory {
  public map(errors: Array<ValidationError>): { [key: string]: string } {
    const mappedErrors: { [key: string]: string } = {};

    for (const error of errors) {
      const errorsValues = Object.values(error.constraints);
      mappedErrors[error.property] = errorsValues.at(errorsValues.length - 1);
    }

    return mappedErrors;
  }
}
