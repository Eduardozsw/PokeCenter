'use client';

import Link from 'next/link';
import { Sparkles, Trophy, LogIn } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-retro text-poke-black drop-shadow-[4px_4px_0px_rgba(255,28,28,1)]">
          POKECENTER
        </h1>
        <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
          Gerencie sua jornada Pokémon com o sistema oficial de registro de treinadores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link 
          href="/login" 
          className="bg-poke-white pixel-border p-8 flex flex-col items-center gap-4 hover:bg-poke-yellow transition-colors group"
        >
          <LogIn size={48} className="text-poke-blue group-hover:scale-110 transition-transform" />
          <div>
            <h2 className="text-lg font-retro">ENTRAR</h2>
            <p className="text-sm opacity-60">Acesse sua Pokédex pessoal</p>
          </div>
        </Link>

        <Link 
          href="/treinadores" 
          className="bg-poke-white pixel-border p-8 flex flex-col items-center gap-4 hover:bg-poke-red hover:text-white transition-colors group"
        >
          <Trophy size={48} className="text-poke-yellow group-hover:rotate-12 transition-transform" />
          <div>
            <h2 className="text-lg font-retro">HALL DA FAMA</h2>
            <p className="text-sm opacity-60">Veja os melhores treinadores</p>
          </div>
        </Link>
      </div>

      <div className="bg-poke-white pixel-border p-6 w-full max-w-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-poke-blue animate-pulse" />
          <p className="text-sm">Novo na região? Comece sua aventura agora!</p>
        </div>
        <Link href="/login" className="pixel-button bg-poke-blue text-white">
          REGISTRAR-SE
        </Link>
      </div>
    </div>
  );
}
