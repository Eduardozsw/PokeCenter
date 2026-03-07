import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, pass: string) {
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('Email already registered');
    }
    return this.usersService.create({
      name,
      email,
      password: pass,
    });
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    
    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileColor: user.profileColor,
      },
    };
  }
}
