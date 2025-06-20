import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';

import { UserGlobal } from 'src/auth/user.global';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        this.clearUserGlobal();
        throw new UnauthorizedException('Authentication token is required');
      }
      const payload = await this.jwtService.verifyAsync(token);
      console.log('payload', payload);

      if (!payload) {
        this.clearUserGlobal();
        throw new UnauthorizedException('Invalid token payload');
      }

      await this.authService.verify(payload);

      request['user'] = payload;
      UserGlobal.id = payload.sub;
      console.log('UserGlobal.id', UserGlobal.id, " | ", request.method, request.url);

      return true;
    } catch (error) {
      this.clearUserGlobal();
      throw new UnauthorizedException(
        error.message || 'Authentication failed'
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private clearUserGlobal(): void {
    UserGlobal.id = null;
  }
}