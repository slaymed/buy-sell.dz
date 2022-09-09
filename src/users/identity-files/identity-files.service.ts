import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { IdentityFile, User } from '../../typeorm/entities';
import { UploadedIdentityFilesDto } from './dto';
import { UserIdentificationStatus } from './enum';
import { UploadedIdentityFiles } from './types';
import { identityFilesFields } from './constants';
import { UsersService } from '../users.service';
import { IdentityFilesStorage } from './storage';
import { ParamsValidator } from '../../class-validator';
import { RemoveFileOptionsInitialState } from './initial-state';

@Injectable()
export class IdentityFilesService {
  public constructor(
    @InjectRepository(IdentityFile)
    public readonly repo: Repository<IdentityFile>,
    private readonly identityFilesStorage: IdentityFilesStorage,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async removeBy(
    identityFile: Partial<IdentityFile>,
    options = new RemoveFileOptionsInitialState(),
  ): Promise<IdentityFile> {
    const savedIdentityFile = await this.repo.findOneBy(identityFile);
    if (savedIdentityFile) return this.remove(savedIdentityFile, options);
  }

  public remove(
    identityFile: IdentityFile,
    options = new RemoveFileOptionsInitialState(),
  ): Promise<IdentityFile> {
    if (options.unlinkFile === true)
      this.identityFilesStorage.remove(identityFile.urn);

    return this.repo.remove(identityFile);
  }

  public async finishIdentityFilesUpload(
    user: User,
    uploadedIdentityFiles: UploadedIdentityFiles,
  ): Promise<Array<IdentityFile>> {
    if (
      !uploadedIdentityFiles ||
      Object.keys(uploadedIdentityFiles).length < 1
    ) {
      const uploadedIdentityFiles = new UploadedIdentityFilesDto();

      for (const alreadyUploadedFile of await this.repo.findBy({ user }))
        uploadedIdentityFiles[alreadyUploadedFile.referenceColumn] =
          alreadyUploadedFile;

      const missingFilesErrors = await ParamsValidator.validate(
        uploadedIdentityFiles,
      );

      if (missingFilesErrors && Object.keys(missingFilesErrors).length > 0)
        throw new BadRequestException(missingFilesErrors);

      throw new BadRequestException(
        `All required identity files are already uploaded, you don't need to do any other action! instead wait for us to identify your account, Thanks!`,
      );
    }

    const errors = {};

    for (const { name } of identityFilesFields) {
      const files: Array<Express.Multer.File> = uploadedIdentityFiles[name];

      const savedIdentityFile = await this.repo.findOneBy({
        userId: user.id,
        referenceColumn: name,
      });

      if (!Array.isArray(files) || files.length < 1) {
        if (!savedIdentityFile) {
          errors[name] = 'must be a png, jpg/jpeg';
          await this.usersService.repo.update(user.id, {
            identificationStatus: UserIdentificationStatus.MISSING_FILES,
          });
        }
        continue;
      }

      const [file, ...notAllowedFiles] = files;

      if (notAllowedFiles.length > 0)
        for (const { filename } of notAllowedFiles)
          this.identityFilesStorage.remove(filename);

      const { validFile, error } = await this.identityFilesStorage.validate(
        file,
      );

      if (!validFile) {
        if (!savedIdentityFile) {
          await this.usersService.repo.update(user.id, {
            identificationStatus: UserIdentificationStatus.MISSING_FILES,
          });
        }

        errors[name] = error;
        this.identityFilesStorage.remove(file.filename);
        continue;
      }

      if (savedIdentityFile) await this.remove(savedIdentityFile);

      const fileRef = this.repo.create({
        referenceColumn: name,
        urn: file.filename,
        url: `${this.configService.get<string>('APP_URL')}${
          this.identityFilesStorage.destination
        }${file.filename}`,
        user,
      });

      await this.repo.save(fileRef);
    }

    if (Object.keys(errors).length > 0) throw new BadRequestException(errors);

    this.usersService.repo.update(user.id, {
      identificationStatus:
        UserIdentificationStatus.IDENTIFICATION_FILES_UPLOADED,
    });

    return this.repo.findBy({ userId: user.id });
  }
}
