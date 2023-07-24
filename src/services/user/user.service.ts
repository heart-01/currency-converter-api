import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserSignUpDto } from '../auth/dto/user-signup.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { removeFile } from './../../helpers/remove-file';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<object> {
    const found = await this.userRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Product ${id} not found`);
    return found;
  }

  async createUser(userSignUpDto: UserSignUpDto): Promise<UserResponseDto> {
    const { name, email, username, password } = userSignUpDto;
    const user = new User();
    user.name = name;
    user.username = username;
    user.email = email;
    user.salt = bcrypt.genSaltSync();
    user.password = await bcrypt.hash(password, user.salt);
    await user.save();

    return new UserResponseDto(user);
  }

  async updateUser(
    id: number,
    userUpdateDto: UserUpdateDto,
    image?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const user = (await this.findOne(id)) as User;

    Object.assign(user, userUpdateDto); // Spread Operator จะคัดลอก properties ที่มีค่าใน userUpdateDto ไปยัง object user

    if (userUpdateDto.password) {
      user.salt = bcrypt.genSaltSync();
      user.password = await bcrypt.hash(userUpdateDto.password, user.salt);
    }

    if (image) {
      await removeFile(user.image);
      user.image = image.filename;
    }

    await this.userRepository.save(user);

    return new UserResponseDto(user);
  }
}
