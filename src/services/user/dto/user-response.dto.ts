import { User } from '../entities/user.entity';

export class UserResponseDto {
  name: string;
  email: string;
  username: string;
  image: string;
  role: string;

  constructor(user: User, role?: string) {
    this.name = user.name;
    this.email = user.email;
    this.username = user.username;
    this.image = user.image;
    this.role = role;
  }
}
