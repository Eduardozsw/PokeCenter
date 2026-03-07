'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Search, House, LogIn } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount and on every path change
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="bg-poke-red border-b-8 border-poke-black p-4 text-poke-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-poke-white border-4 border-poke-black flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
             <div className="w-6 h-6 rounded-full border-4 border-poke-black bg-poke-white"></div>
          </div>
          <h1 className="text-xl md:text-2xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">PokeCenter</h1>
        </Link>

        <nav className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="pixel-button flex items-center gap-2">
                <House size={16} /> <span className="hidden md:inline">Painel</span>
              </Link>
              <Link href="/search" className="pixel-button flex items-center gap-2">
                <Search size={16} /> <span className="hidden md:inline">Capturar</span>
              </Link>
              <button onClick={handleLogout} className="pixel-button flex items-center gap-2 bg-poke-black text-poke-white hover:bg-poke-dark-red">
                <LogOut size={16} /> <span className="hidden md:inline">Sair</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="pixel-button flex items-center gap-2 bg-poke-yellow text-poke-black hover:bg-poke-white">
              <LogIn size={16} /> <span>Entrar</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
