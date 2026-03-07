import React, { useState } from 'react';
import { Trash2, TrendingUp, Shield, Zap, Heart, Edit3, Check, X } from 'lucide-react';
import Image from 'next/image';
import { getTypeColor } from '@/lib/pokemonTypes';

interface PokemonProps {
  pokemon: {
    id: string;
    name: string;
    nickname?: string;
    type: string[];
    level: number;
    hp: number;
    pokedexNumber: number;
    isFavorite: boolean;
  };
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: any) => void;
}

export default function PokemonCard({ pokemon, onDelete, onUpdate }: PokemonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(pokemon.nickname || pokemon.name);
  
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`;

  const handleToggleFavorite = () => {
    if (onUpdate) {
      onUpdate(pokemon.id, { isFavorite: !pokemon.isFavorite });
    }
  };

  const handleSaveNickname = () => {
    if (onUpdate) {
      onUpdate(pokemon.id, { nickname: newNickname });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNewNickname(pokemon.nickname || pokemon.name);
    setIsEditing(false);
  };

  const handleLevelUp = () => {
    if (onUpdate) {
      onUpdate(pokemon.id, { level: pokemon.level + 1 });
    }
  };

  return (
    <div className={`bg-poke-white pixel-border p-4 flex flex-col gap-3 relative group overflow-hidden ${pokemon.isFavorite ? 'ring-4 ring-poke-yellow ring-inset' : ''}`}>
      <div className="absolute z-10 top-0 right-0 p-2 bg-poke-black text-poke-white text-[10px] font-retro flex items-center gap-2">
        {pokemon.isFavorite && <Heart size={10} fill="currentColor" className="text-poke-yellow" />}
        #{pokemon.pokedexNumber.toString().padStart(3, '0')}
      </div>

      <div className="flex justify-center bg-gray-100 pixel-border p-2 relative h-36">
        <div className="relative w-32 h-32">
          <Image
            src={spriteUrl}
            alt={pokemon.name}
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>
        {onUpdate && (
          <button 
            onClick={handleToggleFavorite}
            className={`absolute z-10 bottom-1 right-1 p-1.5 rounded-full cursor-pointer border-2 border-poke-black transition-colors ${pokemon.isFavorite ? 'bg-poke-yellow text-poke-black' : 'bg-white text-gray-400 hover:text-poke-red'}`}
          >
            <Heart size={16} fill={pokemon.isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input 
              type="text" 
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="text-xs p-1 border-2 border-poke-black w-full outline-none"
              autoFocus
            />
            <button onClick={handleSaveNickname} className="text-green-600"><Check size={16}/></button>
            <button onClick={handleCancelEdit} className="text-red-600"><X size={16}/></button>
          </div>
        ) : (
          <div className="flex items-center justify-between group/name">
            <h3 className="text-sm truncate font-retro uppercase grow">
              {pokemon.nickname || pokemon.name}
            </h3>
            {onUpdate && (
              <button 
                onClick={() => setIsEditing(true)}
                className=" group-hover/name:opacity-100 transition-opacity p-1 text-black hover:cursor-pointer"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>
        )}
        
        {pokemon.nickname && (
          <p className="text-[10px] opacity-50 italic -mt-1">{pokemon.name}</p>
        )}

        <div className="flex justify-between items-center mt-1">
          <div className="flex gap-1 flex-wrap">
            {Array.isArray(pokemon.type) ? (
              pokemon.type.map((t) => (
                <span
                  key={t}
                  className="text-white text-[12px] px-2 py-0.5 rounded-full uppercase font-bold"
                  style={{ backgroundColor: getTypeColor(t) }}
                >
                  {t}
                </span>
              ))
            ) : (
              <span
                className="text-white text-[12px] px-2 py-0.5 rounded-full uppercase font-bold"
                style={{ backgroundColor: getTypeColor(String(pokemon.type)) }}
              >
                {String(pokemon.type)}
              </span>
            )}
          </div>
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

      {(onUpdate || onDelete) && (
        <div className="flex gap-2 mt-auto pt-2 border-t-2 border-dashed border-gray-300">
          {onUpdate && (
            <button
              onClick={handleLevelUp}
              className="pixel-button grow flex items-center justify-center gap-1 py-1 text-[8px]!"
              title="Subir de Nível"
            >
              <TrendingUp size={12} /> LEVEL UP
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete && onDelete(pokemon.id)}
              className="pixel-button bg-poke-black text-white hover:bg-poke-red flex items-center justify-center p-1"
              title="Soltar Pokémon"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
