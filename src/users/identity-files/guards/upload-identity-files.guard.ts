import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../../typeorm/entities';
import { UserIdentificationStatus } from '../enum';

@Injectable()
export class UploadIdentityFilesGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const user: User = context.switchToHttp().getRequest().user;

    const allowed =
      user.identificationStatus !==
        UserIdentificationStatus.IDENTIFICATION_IN_PROGRESS &&
      user.identificationStatus !==
        UserIdentificationStatus.ACCOUNT_IDENTIFIED &&
      user.identificationStatus !==
        UserIdentificationStatus.IDENTIFICATION_FILES_UPLOADED;

    if (!allowed) throw new UnauthorizedException(user.identificationStatus);

    return allowed;
  }
}
