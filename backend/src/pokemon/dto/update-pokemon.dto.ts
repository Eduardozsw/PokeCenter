import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePokemonDto {
  @ApiPropertyOptional({ description: 'Novo nível do Pokémon' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  level?: number;

  @ApiPropertyOptional({ description: 'Novo apelido do Pokémon' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: 'Marcar ou desmarcar como favorito' })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}
