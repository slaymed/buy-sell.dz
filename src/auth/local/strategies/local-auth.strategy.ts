import { ParamsValidator } from "../../../class-validator/params-validator";
import { PassportStrategy } from "@nestjs/passport";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Strategy } from "passport-local";
import { LOCAL_STRATEGY } from "../constants";
import { LocalAuthService } from "../local-auth.service";
import { SerializedUserPayload } from "../../types";
import { LocalAuthenticationDto } from "../dto";

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
    public constructor(
        private readonly localAuthService: LocalAuthService,
        private readonly paramsValidator: ParamsValidator
    ) {
        super({ usernameField: "email", passwordField: "password" });
    }

    public async validate(email: string, password: string): Promise<SerializedUserPayload> {
        const localAuthenticationDto = new LocalAuthenticationDto({ email, password });
        await this.paramsValidator.validate(localAuthenticationDto);

        const user = await this.localAuthService.authenticate(localAuthenticationDto);
        return { email: user.email, from: user.from };
    }
}
