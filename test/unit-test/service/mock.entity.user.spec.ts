import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/services/user/user.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/services/user/entities/user.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserSignUpDto } from '../../../src/services/auth/dto/user-signup.dto';

const mockUserReposity = {
  findOne: () => jest.fn(),
  create: () => jest.fn(),
  save: () => jest.fn(),
};

describe('User Service', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        // TypeOrmModule.forRoot({
        //   type: 'postgres',
        //   host: 'localhost',
        //   port: 5432,
        //   username: 'postgres',
        //   password: 'password',
        //   database: 'currency-converter',
        //   entities: [User],
        //   synchronize: false,
        // }),
      ],
      providers: [
        HttpService,
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: {},
        },
        ConfigService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserReposity,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', async () => {
    expect(userService).toBeDefined();
  });

  it('userRepository should be defined', async () => {
    expect(userRepository).toBeDefined();
  });

  it('should return user when success', async () => {
    const userToSave = new User();
    userToSave.name = 'admin';
    userToSave.username = 'username';
    userToSave.email = 'admin@email.com';
    userToSave.salt = 'salted123';
    userToSave.password = 'hashed123';

    const userSignUpDto: UserSignUpDto = {
      name: 'admin',
      email: 'admin@email.com',
      username: 'username',
      password: 'P@ssw0rd',
    };

    // mock function
    jest.spyOn(bcrypt, 'genSaltSync').mockReturnValueOnce('salted123');
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce('hashed123');

    // mockUserReposity.save().mockResolvedValue(user);
    // const saveMock = jest
    //   .spyOn(userRepository, 'save')
    //   .mockResolvedValue(userToSave);

    const resultTestCreateUser = await userService.createUser(userSignUpDto);

    // expect(resultTestCreateUser).toStrictEqual(expectedResult);
    // expect(mockUsersEntity.save).toBeCalledWith(mockCreateUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
