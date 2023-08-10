import { Module } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from '../user/user.service';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, HttpModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
