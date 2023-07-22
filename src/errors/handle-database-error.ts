export function handleDatabaseError(exception: Error): string | null {
  if (parseInt(exception['code']) === 23505 && exception['table'] === 'user') {
    return 'Error, because this username already exists!';
  }

  if (parseInt(exception['code']) === 23514 && exception['table'] === 'user') {
    return 'role is invalid';
  }

  return 'Something went wrong';
}
