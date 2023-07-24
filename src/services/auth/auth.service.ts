import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signIn(userSignInDto: UserSignInDto) {
    const user = await this.verifyUserPassword(userSignInDto);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const { image, ...payload } = user; // Create a new object payload without the 'image' property
    const accessToken = this.jwtService.sign({ ...payload });
    const refreshToken = this.jwtService.sign(
      { ...payload },
      { expiresIn: '7d' },
    );

    return { ...user, token: accessToken, refreshToken };
  }

  async verifyUserPassword(userSignInDto: UserSignInDto) {
    const { username, password } = userSignInDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await user.verifyPassword(password))) {
      return new UserResponseDto(user);
    }
    return;
  }

  signUp(userSignUpDto: UserSignUpDto): Promise<UserResponseDto> {
    return this.userService.createUser(userSignUpDto);
  }

  async signAccessToken(refreshToken: string) {
    try {
      const payloadRefreshToken = this.jwtService.verify(refreshToken);
      const { exp, iat, ...payloadAccessToken } = payloadRefreshToken;
      const accessToken = this.jwtService.sign(payloadAccessToken, {
        expiresIn: '1h',
      });
      return { ...payloadAccessToken, token: accessToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
