import { Controller, Get, Patch, Body, Request, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('global')
  @ApiOperation({ summary: 'Obtém a lista global de treinadores e seus favoritos' })
  async getGlobalList() {
    return this.usersService.findAllWithFavorites();
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtém o perfil do treinador logado' })
  async getProfile(@Request() req: any) {
    const userId = req.user.sub as string;
    return this.usersService.findById(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Atualiza o perfil do treinador logado (nome, senha e cor)' })
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub as string;
    return this.usersService.update(userId, updateUserDto);
  }
}
