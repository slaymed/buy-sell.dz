export type AccountVerificationFiles = {
  frontIDImage: Array<Express.Multer.File>;
  backIDImage: Array<Express.Multer.File>;
  userPicture: Array<Express.Multer.File>;
};
