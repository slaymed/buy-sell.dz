import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { IdentityFile, User } from '../../typeorm/entities';
import { GetUser } from '../decorators';
import { IdentityFilesService } from './identity-files.service';
import { AuthenticatedGuard } from '../../auth/guards';
import { UploadedIdentityFiles } from './types';
import { IdentityFilesStorage } from './storage';
import { identityFilesFields } from './constants';
import { UploadIdentityFilesGuard } from './guards';

@Controller('idf')
export class IdentityFilesController {
  public constructor(
    private readonly identityFilesService: IdentityFilesService,
  ) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  public identificationFiles(@GetUser('id') userId: number) {
    return this.identityFilesService.repo.findBy({ userId });
  }

  @Post('upload')
  @UseGuards(AuthenticatedGuard, UploadIdentityFilesGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      identityFilesFields,
      new IdentityFilesStorage().multerOptions,
    ),
  )
  public async uploadIdentityFiles(
    @GetUser() user: User,
    @UploadedFiles()
    uploadedIdentityFiles: UploadedIdentityFiles,
  ): Promise<Array<IdentityFile>> {
    return this.identityFilesService.finishIdentityFilesUpload(
      user,
      uploadedIdentityFiles,
    );
  }
}
