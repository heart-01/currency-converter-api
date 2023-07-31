import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { InternalAuthGuard } from 'src/guard/internal-auth.guard';
import { RoleUserDto } from './dto/role-update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(InternalAuthGuard)
  @Get(':id')
  find(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch('role/:id')
  updateRole(
    @Param('id') id: number,
    @Body() roleUserDto: RoleUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateRole(id, roleUserDto);
  }

  @UseGuards(AuthGuard())
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
