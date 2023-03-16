import { BACK_IDENTITY_FILE, FRONT_IDENTITY_FILE, USER_PICTURE } from "./constants/identity-files-fields.constants";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

import { IdentityFile, User } from "../../typeorm/entities";
import { UserIdentificationStatus } from "./enum";
import { UsersService } from "../users.service";
import { IdentityFilesStorage } from "./storage";
import { ParamsValidator } from "../../class-validator";
import { RemoveFileOptionsInitialState } from "./initial-state";
import { AllowedIdentityFileRef } from "./types";

@Injectable()
export class IdentityFilesService {
    public constructor(
        @InjectRepository(IdentityFile)
        public readonly repo: Repository<IdentityFile>,
        private readonly identityFilesStorage: IdentityFilesStorage,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly paramsValidator: ParamsValidator
    ) {}

    public readonly requiredIdfRefs: Array<AllowedIdentityFileRef> = [
        FRONT_IDENTITY_FILE,
        BACK_IDENTITY_FILE,
        USER_PICTURE,
    ];

    public async removeBy(
        identityFile: Partial<IdentityFile>,
        options = new RemoveFileOptionsInitialState()
    ): Promise<IdentityFile> {
        const savedIdentityFile = await this.repo.findOneBy(identityFile);
        if (savedIdentityFile) return this.remove(savedIdentityFile, options);
    }

    public remove(identityFile: IdentityFile, options = new RemoveFileOptionsInitialState()): Promise<IdentityFile> {
        if (options.unlinkFile === true) this.identityFilesStorage.remove(identityFile.urn);

        return this.repo.remove(identityFile);
    }

    public async hasAllFiles(user: User): Promise<boolean> {
        const idf = await this.repo.findBy({ userId: user.id });
        if (idf.length < 3) return false;

        for (const ref of this.requiredIdfRefs) {
            if (!idf.find((file) => file.referenceColumn === ref)) return false;
        }

        return true;
    }

    public async syncFile(user: User, ref: AllowedIdentityFileRef, file: Express.Multer.File): Promise<IdentityFile> {
        if (!this.requiredIdfRefs.includes(ref)) {
            if (file) this.identityFilesStorage.remove(file.filename);
            throw new BadRequestException("Unknown File");
        }

        const savedFile = await this.repo.findOneBy({
            userId: user.id,
            referenceColumn: ref,
        });

        if (!file) {
            if (!savedFile)
                await this.usersService.repo.update(user.id, {
                    identificationStatus: UserIdentificationStatus.MISSING_FILES,
                });

            throw new BadRequestException({ [ref]: "must be a png, jpg/jpeg" });
        }

        const { validFile, error } = await this.identityFilesStorage.validate(file);

        if (!validFile) {
            if (!savedFile)
                await this.usersService.repo.update(user.id, {
                    identificationStatus: UserIdentificationStatus.MISSING_FILES,
                });

            this.identityFilesStorage.remove(file.filename);

            throw new BadRequestException({ [ref]: error });
        }

        if (savedFile) this.remove(savedFile);

        const fileRef = this.repo.create({
            referenceColumn: ref,
            urn: file.filename,
            url: `${this.configService.get<string>("APP_URL")}${this.identityFilesStorage.destination}${file.filename}`,
            user,
        });
        await this.repo.save(fileRef);

        const allFilesUploaded = await this.hasAllFiles(user);

        if (allFilesUploaded)
            await this.usersService.repo.update(user.id, {
                identificationStatus: UserIdentificationStatus.IDENTIFICATION_FILES_UPLOADED,
            });

        if (!allFilesUploaded)
            await this.usersService.repo.update(user.id, {
                identificationStatus: UserIdentificationStatus.MISSING_FILES,
            });

        return fileRef;
    }
}
