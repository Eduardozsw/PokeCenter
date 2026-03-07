import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'E-mail do treinador' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do treinador' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
