import { Injectable } from '@nestjs/common';

import { ImageStorage } from '../../../multer/storage';
import { IDENTITY_FILES_DESTINATION } from '../constants';

@Injectable()
export class IdentityFilesStorage extends ImageStorage {
  public constructor() {
    super(IDENTITY_FILES_DESTINATION, 10_000_000);
  }
}
