import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Body } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { IdentityFile, User } from "../../typeorm/entities";
import { GetUser } from "../decorators";
import { IdentityFilesService } from "./identity-files.service";
import { AuthenticatedGuard } from "../../auth/guards";
import { IdentityFilesStorage } from "./storage";
import { IDENTITY_FILE } from "./constants";
import { UploadIdentityFilesGuard } from "./guards";
import { AllowedIdentityFileRef } from "./types";

@Controller("idf")
export class IdentityFilesController {
    public constructor(private readonly identityFilesService: IdentityFilesService) {}

    @Get()
    @UseGuards(AuthenticatedGuard)
    public identificationFiles(@GetUser("id") userId: number): Promise<IdentityFile[]> {
        return this.identityFilesService.repo.findBy({ userId });
    }

    @Post(`upload`)
    @UseGuards(AuthenticatedGuard, UploadIdentityFilesGuard)
    @UseInterceptors(FileInterceptor(IDENTITY_FILE, new IdentityFilesStorage().multerOptions))
    public uploadFrontIdentity(
        @GetUser() user: User,
        @UploadedFile() file: Express.Multer.File,
        @Body("ref") ref: AllowedIdentityFileRef
    ): Promise<IdentityFile> {
        return this.identityFilesService.syncFile(user, ref, file);
    }
}
