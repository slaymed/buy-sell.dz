import { UserType } from '../../users/enums/user-type.enum';

export type SerializedUserPayload = { email: string; from: UserType };
