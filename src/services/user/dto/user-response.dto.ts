import { User } from '../entities/user.entity';

export class UserResponseDto {
  name: string;
  email: string;
  username: string;
  image: string;

  constructor(user: User) {
    this.name = user.name;
    this.email = user.email;
    this.username = user.username;
    this.image = user.image;
  }
}
