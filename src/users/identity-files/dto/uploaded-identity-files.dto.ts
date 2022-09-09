import { IsObject, MinLength } from 'class-validator';
import { IdentityFile } from '../../../typeorm/entities';

import {
  BACK_IDENTITY_FILE,
  FRONT_IDENTITY_FILE,
  USER_PICTURE,
} from '../constants';

export class UploadedIdentityFilesDto {
  @IsObject({ message: 'must not be empty' })
  [FRONT_IDENTITY_FILE]?: IdentityFile;

  @IsObject({ message: 'must not be empty' })
  [BACK_IDENTITY_FILE]?: IdentityFile;

  @IsObject({ message: 'must not be empty' })
  [USER_PICTURE]?: IdentityFile;
}
