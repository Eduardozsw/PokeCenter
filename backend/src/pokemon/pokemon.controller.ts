import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nome ou ID do Pokémon para buscar e salvar' },
      },
      required: ['name'],
    },
  })
  create(@Request() req: any, @Body('name') name: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.create(req.user.sub as string, name);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os seus Pokémons salvos' })
  findAll(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.findAll(req.user.sub as string);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Altera o nível de um Pokémon da sua coleção' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        level: { type: 'number' },
      },
      required: ['level'],
    },
  })
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body('level') level: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.update(req.user.sub as string, id, level);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um Pokémon da sua coleção' })
  remove(@Request() req: any, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pokemonService.remove(req.user.sub as string, id);
  }
}
