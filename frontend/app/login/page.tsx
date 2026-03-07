'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard');
      } else {
        await api.post('/auth/register', { name, email, password });
        setIsLogin(true);
        setSuccess('Registro concluído! Faça login agora.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      if (Array.isArray(message)) {
        setError(message.join('. '));
      } else {
        setError(message || 'Algo deu errado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-poke-white pixel-border p-8">
        <h2 className="text-xl text-center mb-6">{isLogin ? 'Entrar' : 'Registrar'}</h2>

        {error && (
          <div className="bg-poke-red/10 border-4 border-poke-red p-2 mb-4 text-sm text-poke-dark-red">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-poke-green/10 border-4 border-poke-green p-2 mb-4 text-sm text-poke-green">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold">Nome do Treinador</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-poke-black" size={20} />
                <input
                  type="text"
                  placeholder="Ex: Ash Ketchum"
                  className="pixel-input w-full pl-12!"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-bold">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-poke-black" size={20} />
              <input
                type="email"
                placeholder="treinador@pokemail.com"
                className="pixel-input w-full pl-12!"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-bold">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-poke-black" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="pixel-input w-full pl-12!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pixel-button w-full flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Processando...' : isLogin ? (
              <><LogIn size={18} /> ENTRAR</>
            ) : (
              <><UserPlus size={18} /> REGISTRAR</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="underline hover:text-poke-red"
          >
            {isLogin ? 'Novo por aqui? Crie sua conta' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
}
