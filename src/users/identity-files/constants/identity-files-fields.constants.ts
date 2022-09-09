import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const FRONT_IDENTITY_FILE = 'frontIdentityFile';
export const BACK_IDENTITY_FILE = 'backIdentityFile';
export const USER_PICTURE = 'userPicture';

export const identityFilesFields: Array<MulterField> = [
  { name: FRONT_IDENTITY_FILE, maxCount: 1 },
  { name: BACK_IDENTITY_FILE, maxCount: 1 },
  { name: USER_PICTURE, maxCount: 1 },
];
