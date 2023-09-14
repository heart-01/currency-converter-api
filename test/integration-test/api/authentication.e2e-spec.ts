import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../../../src/services/auth/auth.module';
import { AuthService } from '../../../src/services/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../../src/services/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Authentication API:', () => {
  let app: INestApplication;
  let mockAuthService = {
    signIn: () => {
      return {
        id: 1,
        name: 'admin',
        email: 'admin@email.com',
        username: 'username',
        image: 'noimg.png',
        token: '123',
        refreshToken: '456',
      };
    },
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'password',
          database: 'currency-converter',
          entities: [User],
          synchronize: false,
        }),
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`[POST] Admin login success`, async () => {
    const adminData = {
      username: '123123',
      password: '123123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(adminData)
      .expect(201);
    console.log({ response });
    expect(response.body).toEqual(mockAuthService.signIn());
  });

  afterAll(async () => {
    await app.close();
  });
});
