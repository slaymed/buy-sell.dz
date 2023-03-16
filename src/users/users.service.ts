import { IdentityFilesService } from "./identity-files/identity-files.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { User } from "../typeorm/entities";
import { IdentifyUserDto } from "./dto";
import { UserIdentificationStatus } from "./identity-files/enum";
import { BACK_IDENTITY_FILE, FRONT_IDENTITY_FILE, USER_PICTURE } from "./identity-files/constants";

@Injectable()
export class UsersService {
    public constructor(
        @InjectRepository(User)
        public readonly repo: Repository<User>
    ) {}

    public getUserWithRoles(userId: number): Promise<User> {
        return this.repo.findOne({
            where: { id: userId },
            relations: ["roles"],
        });
    }

    public async update(where: FindOptionsWhere<User>, updatedUser: QueryDeepPartialEntity<User>): Promise<User> {
        await this.repo.update(where, updatedUser);
        return this.repo.findOneBy(where);
    }

    public submitForIdentification({ id, identificationStatus }: User): Promise<User> {
        if (identificationStatus !== UserIdentificationStatus.IDENTIFICATION_FILES_UPLOADED)
            switch (identificationStatus) {
                case UserIdentificationStatus.ACCOUNT_IDENTIFIED:
                    throw new UnauthorizedException("Your account is already identified, Thanks!");
                case UserIdentificationStatus.IDENTIFICATION_IN_PROGRESS:
                    throw new UnauthorizedException("Your account is under verification, Please wait!");
                default:
                    throw new UnauthorizedException(
                        "You must upload all of your identity files before submitting for verification!"
                    );
            }

        return this.update({ id }, { identificationStatus: UserIdentificationStatus.IDENTIFICATION_IN_PROGRESS });
    }

    public async identifyUser({ email }: IdentifyUserDto) {
        const user = await this.repo.findOneBy({ email });
        if (!user) throw new BadRequestException({ email: "Invalid user email" });

        if (user.identificationStatus !== UserIdentificationStatus.IDENTIFICATION_IN_PROGRESS)
            switch (user.identificationStatus) {
                case UserIdentificationStatus.IDENTIFICATION_FAILED:
                    throw new UnauthorizedException(
                        `Sorry Admin! wait for the user to re upload new identification files and try again.`
                    );
                case UserIdentificationStatus.ACCOUNT_IDENTIFIED:
                    throw new UnauthorizedException(`Account is already identified, What's wrong Admin?`);
                case UserIdentificationStatus.IDENTIFICATION_FILES_UPLOADED:
                    throw new UnauthorizedException(
                        `Admin you can't identify user account before requesting, wait for the user to request account identification.`
                    );
                default:
                    throw new UnauthorizedException("Please wait until the user upload his identication files");
            }

        return this.update({ id: user.id }, { identificationStatus: UserIdentificationStatus.ACCOUNT_IDENTIFIED });
    }
}
