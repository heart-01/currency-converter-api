import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@ApiBearerAuth('authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authenService: AuthService) {}

  @Post('/signin')
  /* hardcode properties is not show schema in swaggerUI
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', default: 'username' },
        password: { type: 'string', default: 'P@ssw0rd' },
      },
    },
  })
  */
  @ApiBody({ type: UserSignInDto })
  signIn(@Body() userSignInDto: UserSignInDto) {
    return this.authenService.signIn(userSignInDto);
  }

  @Post('/signup')
  signUp(@Body() userSignUpDto: UserSignUpDto): Promise<UserResponseDto> {
    return this.authenService.signUp(userSignUpDto);
  }

  @Post('/refreshToken')
  async refreshToken(@Req() req) {
    return this.authenService.signAccessToken(req.body.refreshToken);
  }
}
