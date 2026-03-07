import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      console.log('AuthGuard: No token found in Authorization header');
      throw new UnauthorizedException();
    }
    
    try {
      // Log length and first/last chars for debugging (safe-ish)
      console.log(`AuthGuard: Verifying token (Length: ${token.length})`);
      console.log(`AuthGuard: Token starts with: ${token.substring(0, 10)}...`);
      
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch (e: any) {
      console.error('AuthGuard: JWT Verification Error:', e.message);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    
    console.log('AuthGuard: Raw Authorization Header:', authHeader);
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      console.log('AuthGuard: Header does not have 2 parts (Bearer <token>)');
      return undefined;
    }
    
    const [type, token] = parts;
    return type === 'Bearer' ? token : undefined;
  }
}
