'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import PokemonCard from '@/components/PokemonCard';
import { RefreshCcw, PlusCircle, User as UserIcon, AlertTriangle } from 'lucide-react';

interface Pokemon {
  id: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleUpdate = async (id: string, data: any) => {
    setError('');
    try {
      const response = await api.patch(`/pokemon/${id}`, data);
      setPokemons(pokemons.map((p: any) => p.id === id ? response.data : p));
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
        setTimeout(() => setError(''), 5000);
      } else {
        alert('Erro ao atualizar Pokémon');
      }
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

  const favoritesCount = pokemons.filter(p => p.isFavorite).length;

  return (
    <div className="space-y-8">
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-poke-white border-4 border-poke-red p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="text-poke-red" size={24} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="bg-poke-white pixel-border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full border-4 border-poke-black flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: user?.profileColor || '#1e90ff' }}
          >
            <UserIcon size={32} />
          </div>
          <div>
            <h2 className="text-lg">Treinador {user?.name}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <p className="text-sm opacity-70">Coleção: {pokemons.length}</p>
              <p className={`text-sm font-bold ${favoritesCount >= 5 ? 'text-poke-red' : 'text-poke-blue'}`}>
                Favoritos: {favoritesCount}/5
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => router.push('/profile')}
            className="pixel-button bg-poke-white hover:bg-gray-100 grow md:grow-0 flex items-center gap-2"
          >
            <UserIcon size={20} /> PERFIL
          </button>
          <button
            onClick={() => router.push('/search')}
            className="pixel-button bg-poke-yellow hover:bg-poke-red grow md:grow-0 flex items-center gap-2"
          >
            <PlusCircle size={20} /> CAPTURAR NOVO
          </button>
        </div>
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
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
