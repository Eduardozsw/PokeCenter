'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import PokemonCard from '@/components/PokemonCard';
import { User, Sparkles, RefreshCcw, Trophy } from 'lucide-react';

export default function TrainersPage() {
  const [globalData, setGlobalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const response = await api.get('/users/global');
        setGlobalData(response.data);
      } catch (err) {
        console.error('Erro ao buscar lista global:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <RefreshCcw className="animate-spin text-poke-red" size={48} />
        <p className="font-retro animate-pulse text-sm">Carregando Hall da Fama...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-retro flex items-center justify-center gap-4 text-poke-black">
          <Trophy className="text-poke-yellow" size={32} /> 
          HALL DA FAMA
          <Trophy className="text-poke-yellow" size={32} />
        </h2>
        <p className="text-sm opacity-70">Veja os Pokémons favoritos de todos os treinadores do mundo!</p>
      </div>

      {globalData.length === 0 ? (
        <div className="bg-poke-white pixel-border p-12 text-center space-y-4">
          <p>Nenhum Pokémon favorito foi registrado ainda.</p>
          <p className="text-xs opacity-60 italic text-poke-red">Seja o primeiro a favoritar seus Pokémons!</p>
        </div>
      ) : (
        <div className="space-y-16">
          {globalData.map((trainer) => (
            <div key={trainer.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Trainer Header Card */}
              <div className="bg-poke-white pixel-border p-4 md:p-6 flex items-center gap-6 shadow-md border-l-[12px]" style={{ borderLeftColor: trainer.profileColor }}>
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-poke-black flex items-center justify-center text-white shrink-0 shadow-inner"
                  style={{ backgroundColor: trainer.profileColor }}
                >
                  <User size={40} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-poke-yellow" />
                    <h3 className="text-lg md:text-xl font-retro text-poke-black">
                      TREINADOR {trainer.name}
                    </h3>
                  </div>
                  <p className="text-xs opacity-60 font-mono mt-1 uppercase">
                    Time de elite • {trainer.pokemons.length} favoritos
                  </p>
                </div>
              </div>

              {/* Favorites Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pl-0 md:pl-4">
                {trainer.pokemons.map((pokemon: any) => (
                  <div key={pokemon.id} className="scale-95 hover:scale-100 transition-transform">
                    <PokemonCard pokemon={pokemon} />
                  </div>
                ))}
              </div>
              <div className="border-b-4 border-dashed border-gray-200 pt-8"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
