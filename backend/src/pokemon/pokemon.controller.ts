import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@ApiTags('pokemon')
@ApiBearerAuth()
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('search/:idOrName')
  @ApiOperation({ summary: 'Busca dados de um Pokémon na PokeAPI externa' })
  getPokemon(@Param('idOrName') idOrName: string) {
    return this.pokemonService.getPokemonFromApi(idOrName);
  }

  @Post()
  @ApiOperation({ summary: 'Adiciona um Pokémon à sua coleção' })
  create(@Request() req: any, @Body() createPokemonDto: CreatePokemonDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.create(req.user.sub as string, createPokemonDto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os seus Pokémons salvos' })
  findAll(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.findAll(req.user.sub as string);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza dados de um Pokémon (nível, apelido, favorito)' })
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdatePokemonDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.update(req.user.sub as string, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um Pokémon da sua coleção' })
  remove(@Request() req: any, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.remove(req.user.sub as string, id);
  }
}
