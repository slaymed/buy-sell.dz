import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { User } from "../../../typeorm/entities";
import { ROLES_KEY } from "../constants";
import { Role } from "../eunms";
import { RolesService } from "../roles.service";

@Injectable()
export class RolesGuard implements CanActivate {
    public constructor(private readonly reflector: Reflector, private readonly rolesService: RolesService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Array<Role>>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const user: User = context.switchToHttp().getRequest().user;

        if (user) {
            const userRoles = await this.rolesService.repo.findBy({ userId: user.id });

            const hasRequiredRoles = requiredRoles.some((role) => userRoles.find((userRole) => userRole.role === role));

            if (!hasRequiredRoles) throw new UnauthorizedException("Permission Denied.");

            return hasRequiredRoles;
        }
    }
}
