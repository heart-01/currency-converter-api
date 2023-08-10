import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { RoleUserDto } from './dto/role-update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  find(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch('role/:id')
  updateRole(
    @Param('id') id: number,
    @Body() roleUserDto: RoleUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateRole(id, roleUserDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  updateUser(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, userUpdateDto, image);
  }
}
