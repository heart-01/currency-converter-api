import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  Req,
} from '@nestjs/common';
import { isEmpty, get } from 'lodash';
import { Response, NextFunction } from 'express';
import { UserRole } from 'src/enumeration/user-role-enum';
import { defineAbilityAdmin } from 'src/services/abilities/admin';
import { defineAbilityUser } from 'src/services/abilities/user';
import { Action } from 'src/enumeration/user-authorization-enum';

interface User {
  name: string;
  username: string;
  email: string;
  image: string;
  role: string;
}

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  isRouteParams(path: string, allowPath: string): boolean {
    const allowPathSplit = allowPath.split('/');
    const pathSplit = path.split('/');

    if (allowPathSplit.length !== pathSplit.length) {
      return false;
    }

    for (let index = 0; index < allowPathSplit.length; index++) {
      if (allowPathSplit[index].includes(':')) {
        allowPathSplit[index] = pathSplit[index];
      }
    }

    return allowPathSplit.join('/') === pathSplit.join('/');
  }

  isActionAllowed(allow: any, action: string, path: string): boolean {
    const isAllowAction = allow.action.includes(action);
    const allowPath = allow.path;

    if (!isAllowAction) {
      return false;
    }

    return allowPath === path || this.isRouteParams(path, allowPath);
  }

  getAbility(user: { role: string; authMachineScopes: Array<string> }): any[] {
    if (!isEmpty(user.authMachineScopes)) {
      const defineAbilityInternal = user.authMachineScopes.map((item) => {
        const colonIndex = item.indexOf(':');
        const path = item.substring(colonIndex);
        const action = item.substring(0, colonIndex);

        return { path, action: Action[action] };
      });
      return defineAbilityInternal;
    }

    if (!isEmpty(user.role)) {
      return user.role.toLocaleLowerCase() === UserRole.ADMIN
        ? defineAbilityAdmin
        : defineAbilityUser;
    }
  }

  async use(@Req() req, res: Response, next: NextFunction) {
    const { user, method: action, path } = req;
    let url = path.replace(/^\/api\//, '');
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    if (isEmpty(action) || isEmpty(path)) {
      throw new ForbiddenException();
    }

    const ability = this.getAbility(user);
    const isAuthorized = ability?.some((allow) =>
      this.isActionAllowed(allow, action, url),
    );

    if (isAuthorized) {
      next();
    } else {
      throw new ForbiddenException();
    }
  }
}
