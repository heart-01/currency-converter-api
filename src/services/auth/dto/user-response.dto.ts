import { User } from '../entities/user.entity';

export class UserResponseDto {
  name: string;
  username: string;
  email: string;
  image: string;

  constructor(user: User) {
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.image = user.image;
  }
}
