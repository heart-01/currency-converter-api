import { IsIn } from 'class-validator';
import { UserRole } from '../../../enumeration/user-role-enum';

export class RoleUserDto {
  @IsIn([UserRole.ADMIN, UserRole.USER])
  role: UserRole;
}
