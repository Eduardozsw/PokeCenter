'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Image from 'next/image';
import { Search, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getTypeColor } from '@/lib/pokemonTypes';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');
    setPokemon(null);
    setSuccess('');

    try {
      const response = await api.get(`/pokemon/search/${query.toLowerCase()}`);
      setPokemon(response.data);
    } catch (err: any) {
      setError('Pokémon não encontrado. Verifique o nome ou número.');
    } finally {
      setLoading(false);
    }
  };

  const handleCatch = async () => {
    if (!pokemon) return;

    setSaving(true);
    setError('');
    try {
      await api.post('/pokemon', { name: pokemon.name });
      setSuccess(`${pokemon.name.toUpperCase()} foi capturado com sucesso!`);
      setPokemon(null);
      setQuery('');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao capturar Pokémon.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-poke-white pixel-border p-6">
        <h2 className="text-lg mb-4 flex items-center gap-2">
          <Search size={24} className="text-poke-red" /> BUSCAR NOVO POKÉMON
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Nome ou ID (ex: Pikachu ou 25)"
            className="pixel-input flex-grow"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="pixel-button bg-poke-red text-white hover:bg-poke-dark-red"
          >
            {loading ? 'Buscando...' : 'PROCURAR'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border-4 border-poke-red p-4 flex items-center gap-3 text-poke-dark-red">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-4 border-poke-green p-4 flex items-center gap-3 text-green-700">
          <CheckCircle2 size={24} />
          <p>{success}</p>
        </div>
      )}

      {pokemon && (
        <div className="bg-poke-white pixel-border p-8 flex flex-col md:flex-row items-center gap-8 animate-in fade-in zoom-in duration-300">
          <div className="w-48 h-48 bg-gray-100 pixel-border flex items-center justify-center p-4 relative">
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`}
              alt={pokemon.name}
              fill
              className="object-contain p-4"
              priority
            />
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <span className="text-xs opacity-50 font-retro">Nº {pokemon.pokedexNumber.toString().padStart(3, '0')}</span>
              <h3 className="text-2xl font-retro uppercase">{pokemon.name}</h3>
              <div className="flex gap-2 flex-wrap mt-1">
                {Array.isArray(pokemon.type) ? (
                  pokemon.type.map((t: string) => (
                    <span 
                      key={t}
                      className="text-white text-xs px-3 py-1 rounded-full uppercase font-bold shadow-sm"
                      style={{ backgroundColor: getTypeColor(t) }}
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span 
                    className="text-white text-xs px-3 py-1 rounded-full uppercase font-bold shadow-sm"
                    style={{ backgroundColor: getTypeColor(String(pokemon.type)) }}
                  >
                    {String(pokemon.type)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="pixel-border p-2 bg-gray-50">
                <p className="text-[10px] opacity-70">HP BASE</p>
                <p className="font-retro">{pokemon.hp}</p>
              </div>
              <div className="pixel-border p-2 bg-gray-50">
                <p className="text-[10px] opacity-70">NÍVEL INICIAL</p>
                <p className="font-retro">{pokemon.level}</p>
              </div>
            </div>

            <button
              onClick={handleCatch}
              disabled={saving}
              className="pixel-button w-full bg-poke-yellow hover:bg-poke-red flex items-center justify-center gap-2 py-3"
            >
              <Sparkles size={20} /> {saving ? 'CAPTURANDO...' : 'LANÇAR POKÉBOLA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
