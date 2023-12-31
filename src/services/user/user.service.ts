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
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private internalURL: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userRepositoryCustom: UserRepository,
  ) {
    const host = this.configService.get<string>('HOST');
    this.internalURL = `${host}`;
  }

  async findAll(keyword: string): Promise<UserResponseDto[]> {
    let found = [];
    if (keyword) {
      found = await this.userRepository
        .createQueryBuilder('user')
        .andWhere('user.name LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
        .getMany();
    } else {
      found = await this.userRepository.find();
    }
    return found.map((found) => new UserResponseDto(found));
  }

  async findOne(id: number): Promise<User> {
    const found = await this.userRepository.findOne({
      where: { id },
    });
    if (!found) throw new NotFoundException(`User ${id} not found`);
    return found;
  }

  async createUser(userSignUpDto: UserSignUpDto): Promise<UserResponseDto> {
    const salt = bcrypt.genSaltSync();
    const password = await bcrypt.hash(userSignUpDto.password, salt);
    const user = await this.userRepositoryCustom.createNewUser({
      ...userSignUpDto,
      salt,
      password,
    });
    return new UserResponseDto(user);
  }

  async updateUser(
    id: number,
    userUpdateDto: UserUpdateDto,
    image?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const authenticateAuth0 = await (
      await lastValueFrom(
        this.httpService.post('https://siwat-dev.us.auth0.com/oauth/token', {
          client_id: 'nUnIxQSTazQ4PBALWoznljhjJBSqDElI',
          client_secret:
            'tUMH7NciLnaCTcA2ZGWIhWO86JM1kb8MBkSE0k-OT-643_5ppv3RxtqGYAGJuB2c',
          audience: 'https://currency-converter-api',
          grant_type: 'client_credentials',
        }),
      )
    ).data;

    let userInfo: User = null;
    try {
      userInfo = await (
        await lastValueFrom(
          this.httpService.get(`${this.internalURL}/api/user/${id}`, {
            headers: {
              Authorization: authenticateAuth0.access_token,
              internal: 'internal-api-key',
            },
          }),
        )
      ).data;
    } catch (err) {
      throw new NotFoundException(err.response.data.message || err.message);
    }

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

  async deleteUser(id: number): Promise<string> {
    const user = await this.findOne(id);
    user.deletedAt = new Date();
    await this.userRepository.save(user);
    return 'success';
  }
}
