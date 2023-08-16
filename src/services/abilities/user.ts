import { Action } from 'src/enumeration/user-authorization-enum';

export const defineAbilityUser = [
  { path: 'user/:id', action: Action.update },
  { path: 'auth/refreshToken', action: Action.create },
  { path: 'currency', action: Action.read },
  { path: 'currency/:id', action: Action.read },
  { path: 'exchange-rate', action: Action.read },
  { path: 'exchange-rate/:id', action: Action.read },
];
