import { BACK_IDENTITY_FILE, FRONT_IDENTITY_FILE, USER_PICTURE } from "../constants";

export type AllowedIdentityFileRef = typeof FRONT_IDENTITY_FILE | typeof BACK_IDENTITY_FILE | typeof USER_PICTURE;
