import {
  BACK_IDENTITY_FILE,
  FRONT_IDENTITY_FILE,
  USER_PICTURE,
} from '../constants';

export type UploadedIdentityFiles = {
  [FRONT_IDENTITY_FILE]: Array<Express.Multer.File>;
  [BACK_IDENTITY_FILE]: Array<Express.Multer.File>;
  [USER_PICTURE]: Array<Express.Multer.File>;
};
