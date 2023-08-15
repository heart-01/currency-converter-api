import { Action } from 'src/enumeration/user-authorization-enum';

export const defineAbilityUser = [
  { path: 'user', action: Action.read },
  { path: 'user/:id', action: Action.update },
  { path: 'auth/refreshToken', action: Action.create },
];
