import React from 'react';
import { Trash2, TrendingUp, Shield, Zap } from 'lucide-react';

interface PokemonProps {
  pokemon: {
    id: string;
    name: string;
    type: string;
    level: number;
    hp: number;
    pokedexNumber: number;
  };
  onDelete?: (id: string) => void;
  onLevelUp?: (id: string, currentLevel: number) => void;
}

export default function PokemonCard({ pokemon, onDelete, onLevelUp }: PokemonProps) {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`;

  return (
    <div className="bg-poke-white pixel-border p-4 flex flex-col gap-3 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-2 bg-poke-black text-poke-white text-[10px] font-retro">
        #{pokemon.pokedexNumber.toString().padStart(3, '0')}
      </div>

      <div className="flex justify-center bg-gray-100 pixel-border p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className="w-32 h-32 object-contain"
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm truncate">{pokemon.name}</h3>
        <div className="flex justify-between items-center">
          <span className="bg-poke-blue text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
            {pokemon.type}
          </span>
          <span className="font-retro text-[10px]">LV. {pokemon.level}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center gap-1 text-xs">
          <Shield size={12} className="text-poke-blue" />
          <span>HP: {pokemon.hp}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Zap size={12} className="text-poke-yellow" />
          <span>Status: OK</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto pt-2 border-t-2 border-dashed border-gray-300">
        <button
          onClick={() => onLevelUp && onLevelUp(pokemon.id, pokemon.level)}
          className="pixel-button flex-grow flex items-center justify-center gap-1 py-1 !text-[8px]"
          title="Subir de Nível"
        >
          <TrendingUp size={12} /> LEVEL UP
        </button>
        <button
          onClick={() => onDelete && onDelete(pokemon.id)}
          className="pixel-button bg-poke-black text-white hover:bg-poke-red flex items-center justify-center p-1"
          title="Soltar Pokémon"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
