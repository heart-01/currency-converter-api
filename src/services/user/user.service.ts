import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserSignUpDto } from '../auth/dto/user-signup.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { removeFile } from './../../helpers/remove-file';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { RoleUserDto } from './dto/role-update.dto';

@Injectable()
export class UserService {
  private internalURL: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('HOST');
    const port = this.configService.get<string>('PORT');
    this.internalURL = `${host}:${port}`;
  }

  async findOne(id: number): Promise<User> {
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
    const userInfo = await (
      await lastValueFrom(
        this.httpService.get(`${this.internalURL}/user/${id}`, {
          headers: { internal: 'internal-api-key' },
        }),
      )
    ).data;

    Object.assign(userInfo, userUpdateDto); // Spread Operator จะคัดลอก properties ที่มีค่าใน userUpdateDto ไปยัง object user

    if (userUpdateDto.password) {
      userInfo.salt = bcrypt.genSaltSync();
      userInfo.password = await bcrypt.hash(
        userUpdateDto.password,
        userInfo.salt,
      );
    }
    if (image) {
      await removeFile(userInfo.image);
      userInfo.image = image.filename;
    }

    await this.userRepository.save(userInfo);
    return new UserResponseDto(userInfo);
  }

  async updateRole(
    id: number,
    roleUserDto: RoleUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    Object.assign(user, roleUserDto);
    await this.userRepository.save(user);
    return new UserResponseDto(user, user.role);
  }
}
