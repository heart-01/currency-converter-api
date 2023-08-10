import { Action } from 'src/enumeration/user-authorization-enum';

export const defineAbilityUser = [
  { path: 'user', action: Action.manage },
  { path: 'user/:id', action: Action.update },
  { path: 'auth/refreshToken', action: Action.create },
];
