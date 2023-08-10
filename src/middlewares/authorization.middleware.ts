import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  Req,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserRole } from 'src/enumeration/user-role-enum';
import { defineAbilityAdmin } from 'src/services/abilities/admin';
import { defineAbilityUser } from 'src/services/abilities/user';

interface User {
  name: string;
  username: string;
  email: string;
  image: string;
  role: string;
}

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  throwUnlessCan(user: User, action: string, path: string) {
    const userRole = user.role.toUpperCase();
    const ability =
      userRole === UserRole.ADMIN ? defineAbilityAdmin : defineAbilityUser;

    let accessible = false;
    for (const allow of ability) {
      const isAllowAction = allow.action.includes(action);
      if (allow.path === path && isAllowAction) {
        accessible = true;
      }
    }

    return accessible;
  }

  async use(@Req() req, res: Response, next: NextFunction) {
    const { user, method: action, path } = req;
    const url = path.replace(/^\/api\//, '');
    const ability = this.throwUnlessCan(user, action, url);

    if (ability) {
      next();
    } else {
      throw new ForbiddenException();
    }
  }
}
