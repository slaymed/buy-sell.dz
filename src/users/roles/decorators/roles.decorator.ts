import { SetMetadata } from '@nestjs/common';

import { ROLES_KEY } from '../constants';
import { Role } from '../eunms';

export const Roles = (...roles: Array<Role>) => SetMetadata(ROLES_KEY, roles);
