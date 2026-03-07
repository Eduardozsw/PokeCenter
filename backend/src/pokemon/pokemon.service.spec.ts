import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            pokemon: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return pokemon data correctly', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: {
        id: 25,
        name: 'pikachu',
        types: [{ type: { name: 'electric' } }],
        stats: [{ base_stat: 35, stat: { name: 'hp' } }],
      },
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of(mockResponse as AxiosResponse));

    const result = await service.getPokemonFromApi('pikachu');

    expect(result.pokedexNumber).toBe(25);
    expect(result.name).toBe('pikachu');
    expect(result.type).toEqual(['electric']);
    expect(result.hp).toBe(35);
    expect(result.level).toBeGreaterThanOrEqual(1);
    expect(result.level).toBeLessThanOrEqual(20);
    
    expect(httpService.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
    );
  });

  it('should return multiple types correctly', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: {
        id: 6,
        name: 'charizard',
        types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
        stats: [{ base_stat: 78, stat: { name: 'hp' } }],
      },
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of(mockResponse as AxiosResponse));

    const result = await service.getPokemonFromApi('charizard');

    expect(result.type).toEqual(['fire', 'flying']);
  });

  it('should handle case-insensitive names', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: {
        id: 25,
        name: 'pikachu',
        types: [{ type: { name: 'electric' } }],
        stats: [{ base_stat: 35, stat: { name: 'hp' } }],
      },
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of(mockResponse as AxiosResponse));

    await service.getPokemonFromApi('PIKACHU');

    expect(httpService.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
    );
  });
});
