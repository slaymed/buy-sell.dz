import { ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from "argon2";

import { User } from "../typeorm/entities";
import { Role } from "../users/roles/eunms";
import { RolesService } from "../users/roles/roles.service";
import { UsersService } from "../users/users.service";
import { AuthenticationDto } from "./dto";

@Injectable()
export class AuthService {
    public constructor(private readonly usersService: UsersService, private readonly rolesService: RolesService) {}

    public async authenticate({ email, password, from }: AuthenticationDto): Promise<User> {
        const user = await this.usersService.repo.findOneBy({ email });

        if (!user) {
            const hashedPassword = await argon.hash(password);

            const user = this.usersService.repo.create({ email, password: hashedPassword, from });
            await this.usersService.repo.save(user);

            const role = this.rolesService.repo.create({ role: Role.USER, user });
            await this.rolesService.repo.save(role);

            return user;
        }

        if (user.from !== from) throw new ForbiddenException("Credentials Taken");

        const passwordMatch = await argon.verify(user.password, password);
        if (!passwordMatch) throw new ForbiddenException("Invalid Credentials");

        return user;
    }
}
