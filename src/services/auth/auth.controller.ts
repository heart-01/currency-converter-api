import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenService: AuthService) {}

  @Post('/signin')
  signIn(@Body() userSignInDto: UserSignInDto) {
    return this.authenService.signIn(userSignInDto);
  }

  @Post('/signup')
  signUp(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<UserResponseDto> {
    return this.authenService.signUp(userSignUpDto);
  }

  @UseGuards(AuthGuard())
  @Post('/refreshToken')
  async refreshToken(@Req() req) {
    return this.authenService.signAccessToken(req.body.refreshToken);
  }
}
