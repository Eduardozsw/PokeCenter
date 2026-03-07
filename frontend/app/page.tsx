'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Zap, Swords } from 'lucide-react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="flex flex-col items-center text-center space-y-12 py-10">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl drop-shadow-md">BEM-VINDO AO POKÉCENTER</h2>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          O sistema definitivo para treinadores gerenciarem sua coleção de Pokémon com tecnologia de ponta e estética clássica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div className="bg-poke-white pixel-border p-6 space-y-3">
          <div className="w-12 h-12 bg-poke-red rounded-full flex items-center justify-center mx-auto text-white">
            <Sparkles />
          </div>
          <h3 className="text-sm">Capture</h3>
          <p className="text-xs">Busque qualquer Pokémon e adicione à sua coleção pessoal instantaneamente.</p>
        </div>

        <div className="bg-poke-white pixel-border p-6 space-y-3">
          <div className="w-12 h-12 bg-poke-blue rounded-full flex items-center justify-center mx-auto text-white">
            <TrendingUpIcon />
          </div>
          <h3 className="text-sm">Evolua</h3>
          <p className="text-xs">Treine seus companheiros e suba de nível para torná-los cada vez mais fortes.</p>
        </div>

        <div className="bg-poke-white pixel-border p-6 space-y-3">
          <div className="w-12 h-12 bg-poke-yellow rounded-full flex items-center justify-center mx-auto text-poke-black">
            <Shield />
          </div>
          <h3 className="text-sm">Organize</h3>
          <p className="text-xs">Mantenha sua Pokedex organizada e visualize as estatísticas de cada membro da equipe.</p>
        </div>
      </div>

      <div className="pt-8">
        {isLoggedIn ? (
          <Link href="/dashboard" className="pixel-button text-lg px-8 py-4 bg-poke-red text-white hover:bg-poke-dark-red">
            ACESSAR MEU PAINEL
          </Link>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/login" className="pixel-button text-lg px-8 py-4 bg-poke-red text-white hover:bg-poke-dark-red">
              COMEÇAR JORNADA
            </Link>
            <Link href="/login" className="pixel-button text-lg px-8 py-4">
              CRIAR CONTA
            </Link>
          </div>
        )}
      </div>

      <div className="w-full bg-poke-black pixel-border p-1">
        <div className="bg-poke-white p-4 text-xs font-mono uppercase tracking-widest overflow-hidden whitespace-nowrap">
           <div className="animate-marquee inline-block">
             Aviso: Mantenha seus Pokémon sempre saudáveis visitando um Centro Pokémon próximo! • Pokédex sincronizada com a nuvem • Versão 1.0.0-PIXEL •
           </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
  );
}
