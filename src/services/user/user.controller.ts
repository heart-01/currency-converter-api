import { Body, Controller, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<object> {
    return this.userService.updateUser(id, userUpdateDto, image);
  }
}
