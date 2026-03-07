import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

interface PokeAPIResponse {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getPokemonFromApi(idOrName: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<PokeAPIResponse>(
          `https://pokeapi.co/api/v2/pokemon/${idOrName.toLowerCase()}`,
        ),
      );
      const { data } = response;

      const hpStat = data.stats.find((s) => s.stat.name === 'hp');

      return {
        pokedexNumber: data.id,
        name: data.name,
        type: data.types.map((t) => t.type.name).join(', '),
        hp: hpStat ? hpStat.base_stat : 0,
        level: 1,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('Pokémon não encontrado na PokeAPI', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Erro ao buscar dados na PokeAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(userId: string, idOrName: string) {
    const pokemonData = await this.getPokemonFromApi(idOrName);
    
    return this.prisma.pokemon.create({
      data: {
        ...pokemonData,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.pokemon.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: string, id: string, level: number) {
    const pokemon = await this.prisma.pokemon.findFirst({
      where: { id, userId },
    });

    if (!pokemon) {
      throw new HttpException('Pokémon não encontrado na sua lista', HttpStatus.NOT_FOUND);
    }

    return this.prisma.pokemon.update({
      where: { id },
      data: { level },
    });
  }

  async remove(userId: string, id: string) {
    const pokemon = await this.prisma.pokemon.findFirst({
      where: { id, userId },
    });

    if (!pokemon) {
      throw new HttpException('Pokémon não encontrado na sua lista', HttpStatus.NOT_FOUND);
    }

    return this.prisma.pokemon.delete({
      where: { id },
    });
  }
}
