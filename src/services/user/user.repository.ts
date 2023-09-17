import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createNewUser(user: {
    name: string;
    username: string;
    email: string;
    salt: string;
    password: string;
  }): Promise<User> {
    const newUser = new User();
    newUser.name = user.name;
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.salt = user.salt;
    newUser.password = user.password;
    await newUser.save();
    return newUser;
  }
}
