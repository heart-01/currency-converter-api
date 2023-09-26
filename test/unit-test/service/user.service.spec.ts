import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/services/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/services/user/entities/user.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserSignUpDto } from '../../../src/services/auth/dto/user-signup.dto';
import { UserResponseDto } from '../../../src/services/user/dto/user-response.dto';
import { UserRepository } from '../../../src/services/user/user.repository';

const mockUserData = () => {
  const userToSave = new User();
  userToSave.id = 1;
  userToSave.name = 'admin';
  userToSave.username = 'username';
  userToSave.email = 'admin@email.com';
  userToSave.salt = 'salted123';
  userToSave.password = 'hashed123';

  return userToSave;
};

describe('User Service', () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        HttpService,
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: {},
        },
        ConfigService,
        UserService,
        {
          provide: UserRepository,
          useValue: {
            createNewUser: jest.fn().mockResolvedValue(mockUserData()),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: () => jest.fn().mockResolvedValue(mockUserData()),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  it('Should pass if userService be defined', async () => {
    expect(userService).toBeDefined();
  });

  it('Should pass if UserRepositoryCustom be defined', async () => {
    expect(UserRepository).toBeDefined();
  });

  it('Should pass if return user when success', async () => {
    const userSignUpDto: UserSignUpDto = {
      name: 'admin',
      email: 'admin@email.com',
      username: 'username123',
      password: 'P@ssw0rd',
    };

    const spyGenSaltFunc = jest
      .spyOn(bcrypt, 'genSaltSync')
      .mockReturnValueOnce('salted123');
    const spyHashFunc = jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValueOnce('hashed123');

    const result: UserResponseDto = await userService.createUser(userSignUpDto);

    expect(result).not.toBeNull();
    expect(spyGenSaltFunc).toBeCalledTimes(1);
    expect(spyHashFunc).toBeCalledTimes(1);
  });

  it('Should pass if get user by id success', async () => {
    const result: UserResponseDto = await userService.findOne(1);
    expect(result).not.toBeNull();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
