import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { config } from '../config/default.config';
import { AuthJwtStrategy } from '../services/auth/auth.jwt.strategy';
import * as jwt from 'jsonwebtoken';

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

    if (isEmpty(token)) {
      throw new UnauthorizedException();
    }

    // authenticate Auth0
    if (internalApiKey === this.configService.get<string>('INTERNAL_API_KEY')) {
      try {
        const { scope } = jwt.decode(token) as { scope: string };
        const authMachineToken = jwt.sign(
          config.authentication.auth0Jwt.payload,
          this.configService.get<string>('INTERNAL_API_KEY'),
          config.authentication.auth0Jwt.options,
        );
        Object.assign(req, {
          user: { authMachineToken, authMachineScopes: scope?.split(' ') },
        });

        return next();
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    // authenticate Service
    try {
      const decodedToken = await this.jwtService.verify(token);
      const user = await this.authJwtStrategy.validate({
        username: decodedToken.username,
      });
      Object.assign(req, { user });

      return next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
