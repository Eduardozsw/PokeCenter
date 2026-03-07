import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nome do treinador' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'E-mail do treinador' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do treinador' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @Matches(/[a-zA-Z]/, { message: 'A senha deve conter pelo menos uma letra' })
  password: string;
}
