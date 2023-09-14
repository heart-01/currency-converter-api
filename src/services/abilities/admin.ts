import { Action } from '../../enumeration/user-authorization-enum';

export const defineAbilityAdmin = [
  { path: 'user', action: Action.read },
  { path: 'user/:id', action: Action.read },
  { path: 'user/:id', action: Action.update },
  { path: 'user/:id', action: Action.remove },
  { path: 'auth/refreshToken', action: Action.create },
  { path: 'user/role/:id', action: Action.update },
  { path: 'currency', action: Action.manage },
  { path: 'currency/:id', action: Action.manage },
  { path: 'exchange-rate', action: Action.manage },
  { path: 'exchange-rate/:id', action: Action.manage },
];
