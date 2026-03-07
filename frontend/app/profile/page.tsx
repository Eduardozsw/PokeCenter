'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User, Save, ArrowLeft, Lock, Palette } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profileColor, setProfileColor] = useState('#ff1c1c');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setName(user.name);
      setProfileColor(user.profileColor || '#ff1c1c');
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData: any = { name, profileColor };
      if (password) {
        updateData.password = password;
      }

      const response = await api.patch('/users/profile', updateData);
      
      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      setSuccess('Perfil atualizado com sucesso!');
      setPassword(''); // Clear password field
      
      // Small delay to show success before potentially redirecting or refreshing
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const message = err.response?.data?.message;
      if (Array.isArray(message)) {
        setError(message.join('. '));
      } else {
        setError(message || 'Erro ao atualizar perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    '#ff1c1c', // Poké Red
    '#1e90ff', // Poké Blue
    '#ffd700', // Poké Yellow
    '#32cd32', // Poké Green
    '#A33EA1', // Poison
    '#F95587', // Psychic
    '#EE8130', // Fire
    '#6390F0', // Water
    '#7AC74C', // Grass
    '#000000', // Black
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="pixel-button p-2 bg-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-retro">CONFIGURAÇÕES DO TREINADOR</h2>
      </div>

      <div className="bg-poke-white pixel-border p-8 space-y-6">
        {error && (
          <div className="bg-red-100 border-4 border-poke-red p-4 text-sm text-poke-dark-red">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-4 border-poke-green p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Preview */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs font-bold uppercase">Avatar</p>
              <div 
                className="w-32 h-32 rounded-full border-8 border-poke-black flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ backgroundColor: profileColor }}
              >
                <User size={64} />
              </div>
            </div>

            <div className="grow space-y-4 w-full">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold">Nome do Treinador</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-poke-black" size={20} />
                  <input
                    type="text"
                    className="pixel-input w-full pl-12!"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold">Nova Senha (deixe em branco para não alterar)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-poke-black" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="pixel-input w-full pl-12!"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-200">
            <label className="text-xs uppercase font-bold flex items-center gap-2">
              <Palette size={16} /> Cor do Perfil
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setProfileColor(color)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform active:scale-95 ${
                    profileColor === color ? 'border-white ring-4 ring-poke-black scale-110' : 'border-poke-black'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[10px] font-bold">Custom:</span>
                <input 
                  type="color" 
                  value={profileColor}
                  onChange={(e) => setProfileColor(e.target.value)}
                  className="w-10 h-10 p-0 border-4 border-poke-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pixel-button w-full bg-poke-green text-white hover:bg-green-600 flex items-center justify-center gap-2 py-4 mt-6"
          >
            <Save size={20} /> {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </button>
        </form>
      </div>
    </div>
  );
}
