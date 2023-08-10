import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { AuthJwtStrategy } from 'src/services/auth/auth.jwt.strategy';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authJwtStrategy: AuthJwtStrategy,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const internalApiKey = req.headers?.internal;

    if (internalApiKey) {
      if (
        internalApiKey === this.configService.get<string>('INTERNAL_API_KEY')
      ) {
        return next();
      }
      throw new UnauthorizedException('Invalid token');
    }

    if (isEmpty(token)) {
      throw new UnauthorizedException();
    }
    try {
      const decodedToken = await this.jwtService.verify(token);
      const user = await this.authJwtStrategy.validate(decodedToken.username);
      Object.assign(req, { user });

      return next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
