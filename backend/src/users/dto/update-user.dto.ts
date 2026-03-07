import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Novo nome do treinador' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Nova senha do treinador' })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @Matches(/[a-zA-Z]/, { message: 'A senha deve conter pelo menos uma letra' })
  password?: string;

  @ApiPropertyOptional({ description: 'Cor da foto de perfil (hexadecimal)', example: '#ff1c1c' })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'A cor deve ser um código hexadecimal válido (ex: #ff1c1c)' })
  profileColor?: string;
}
