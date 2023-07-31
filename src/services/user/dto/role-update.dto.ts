import { IsIn } from 'class-validator';
import { UserRole } from 'src/enumeration/user-role-enum';

export class RoleUserDto {
  @IsIn([UserRole.ADMIN, UserRole.USER])
  role: UserRole;
}
