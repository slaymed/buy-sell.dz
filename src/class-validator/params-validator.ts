import { Injectable, BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { ExceptionFactory } from "./exception-factory";

@Injectable()
export class ParamsValidator {
    public async validate(object: object): Promise<void> {
        const errors = await validate(object);

        if (errors.length > 0) {
            const mappedErrors = new ExceptionFactory().map(errors);

            if (Object.keys(mappedErrors).length > 0) throw new BadRequestException(mappedErrors);
        }
    }
}
