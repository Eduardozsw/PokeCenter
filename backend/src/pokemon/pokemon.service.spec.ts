import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
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

    const result = await service.getPokemon('pikachu');

    expect(result).toEqual({
      pokedexNumber: 25,
      name: 'pikachu',
      type: 'electric',
      hp: 35,
      level: 1,
    });
    expect(httpService.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
    );
  });

  it('should join multiple types with a comma', async () => {
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

    const result = await service.getPokemon('charizard');

    expect(result.type).toBe('fire, flying');
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

    await service.getPokemon('PIKACHU');

    expect(httpService.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
    );
  });
});
