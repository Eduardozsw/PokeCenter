'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import PokemonCard from '@/components/PokemonCard';
import { RefreshCcw, PlusCircle, User as UserIcon } from 'lucide-react';

export default function DashboardPage() {
  const [pokemons, setPokemons] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pokemon');
      setPokemons(response.data);
    } catch (err) {
      console.error(err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja soltar este Pokémon na natureza?')) {
      try {
        await api.delete(`/pokemon/${id}`);
        setPokemons(pokemons.filter((p: any) => p.id !== id));
      } catch (err) {
        alert('Erro ao soltar Pokémon');
      }
    }
  };

  const handleLevelUp = async (id: string, currentLevel: number) => {
    try {
      const response = await api.patch(`/pokemon/${id}`, { level: currentLevel + 1 });
      setPokemons(pokemons.map((p: any) => p.id === id ? response.data : p));
    } catch (err) {
      alert('Erro ao subir de nível');
    }
  };

  if (loading && pokemons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <RefreshCcw className="animate-spin text-poke-red" size={48} />
        <p className="font-retro animate-pulse">Carregando Pokédex...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-poke-white pixel-border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-poke-blue rounded-full border-4 border-poke-black flex items-center justify-center text-white">
            <UserIcon size={32} />
          </div>
          <div>
            <h2 className="text-lg">Treinador {user?.name}</h2>
            <p className="text-sm opacity-70">Sua coleção tem {pokemons.length} Pokémon</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/search')}
          className="pixel-button bg-poke-yellow hover:bg-poke-red flex items-center gap-2"
        >
          <PlusCircle size={20} /> CAPTURAR NOVO
        </button>
      </div>

      {pokemons.length === 0 ? (
        <div className="text-center py-20 bg-gray-100 border-4 border-dashed border-gray-400">
          <p className="mb-4">Você ainda não tem nenhum Pokémon em sua coleção.</p>
          <button
            onClick={() => router.push('/search')}
            className="pixel-button"
          >
            Começar Jornada
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pokemons.map((pokemon: any) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onDelete={handleDelete}
              onLevelUp={handleLevelUp}
            />
          ))}
        </div>
      )}
    </div>
  );
}
