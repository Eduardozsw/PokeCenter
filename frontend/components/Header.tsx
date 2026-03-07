'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Search, House, LogIn, Menu, X, Trophy } from 'lucide-react';

interface User {
  name: string;
  profileColor?: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check login status and user data on mount and on every path change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="bg-poke-red border-b-8 border-poke-black p-4 text-poke-white relative z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-poke-black flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 overflow-hidden shrink-0 relative"
            style={{ backgroundColor: isLoggedIn ? (user?.profileColor || '#ffffff') : '#ffffff' }}
          >
            <div className="relative w-full h-full p-1">
              <Image
                src="/image.png"
                alt="PokeCenter Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
          <h1 className="text-lg md:text-2xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] truncate">PokeCenter</h1>
        </Link>

        {/* Desktop and Non-logged Mobile Auth Link */}
        <nav className="flex items-center gap-2 md:gap-4">
          <Link href="/treinadores" className={`pixel-button hidden sm:flex items-center gap-2 ${pathname === '/treinadores' ? 'bg-poke-yellow text-poke-black' : ''}`}>
            <Trophy size={16} /> <span className="hidden md:inline">Treinadores</span>
          </Link>

          {isLoggedIn ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:flex gap-4">
                <Link href="/dashboard" className={`pixel-button flex items-center gap-2 ${pathname === '/dashboard' ? 'bg-poke-blue text-white' : ''}`}>
                  <House size={16} /> <span>Painel</span>
                </Link>
                <Link href="/search" className={`pixel-button flex items-center gap-2 ${pathname === '/search' ? 'bg-poke-yellow text-black' : ''}`}>
                  <Search size={16} /> <span>Capturar</span>
                </Link>
                <button onClick={handleLogout} className="pixel-button flex items-center gap-2 bg-poke-black text-poke-white hover:bg-poke-dark-red">
                  <LogOut size={16} /> <span>Sair</span>
                </button>
              </div>

              {/* Mobile View Toggle */}
              <div className="md:hidden" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="pixel-button p-2 bg-poke-white text-poke-black"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Mobile Dropdown */}
                {isMenuOpen && (
                  <div className="absolute top-full right-4 mt-2 w-48 bg-poke-white pixel-border p-2 flex flex-col gap-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link href="/treinadores" className="pixel-button sm:hidden flex items-center gap-3 justify-start w-full hover:bg-poke-yellow hover:text-black">
                      <Trophy size={18} /> <span>Treinadores</span>
                    </Link>
                    <Link href="/dashboard" className="pixel-button flex items-center gap-3 justify-start w-full hover:bg-poke-blue hover:text-white">
                      <House size={18} /> <span>Painel</span>
                    </Link>
                    <Link href="/search" className="pixel-button flex items-center gap-3 justify-start w-full hover:bg-poke-yellow hover:text-black">
                      <Search size={18} /> <span>Capturar</span>
                    </Link>
                    <div className="border-t-2 border-dashed border-gray-300 my-1"></div>
                    <button 
                      onClick={handleLogout} 
                      className="pixel-button flex items-center gap-3 justify-start w-full bg-poke-black text-white hover:bg-poke-red"
                    >
                      <LogOut size={18} /> <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="pixel-button flex items-center gap-2 bg-poke-yellow text-poke-black hover:bg-poke-white">
                <LogIn size={16} /> <span>Entrar</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
