import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParamsValidator } from "../../class-validator";

import { IdentityFile } from "../../typeorm/entities";
import { UsersModule } from "../users.module";
import { IdentityFilesController } from "./identity-files.controller";
import { IdentityFilesService } from "./identity-files.service";
import { IdentityFilesStorage } from "./storage";

@Module({
    imports: [TypeOrmModule.forFeature([IdentityFile]), forwardRef(() => UsersModule)],
    controllers: [IdentityFilesController],
    providers: [IdentityFilesService, IdentityFilesStorage, ParamsValidator],
    exports: [IdentityFilesService],
})
export class IdentityFilesModule {}
