import { Injectable } from "@nestjs/common";

import { User } from "../../typeorm/entities";
import { UserType } from "../../users/enums/user-type.enum";
import { LocalAuthenticationDto } from "./dto";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalAuthService {
    public constructor(private readonly authService: AuthService) {}

    public authenticate(localAuthenticationDto: LocalAuthenticationDto): Promise<User> {
        return this.authService.authenticate({ ...localAuthenticationDto, from: UserType.LOCAL });
    }
}
