import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePokemonDto {
  @ApiProperty({ description: 'Nome ou ID do Pokémon para buscar na PokeAPI' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
