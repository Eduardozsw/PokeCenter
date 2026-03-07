import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PokeCenter - Centro Pokémon Online",
    template: "%s | PokeCenter",
  },
  description: "Gerencie sua coleção de Pokémon com estilo retro no melhor Centro Pokémon da web.",
  keywords: ["pokemon", "pokedex", "treinador pokemon", "nintendo"],
  authors: [{ name: "PokeCenter Team" }],
  openGraph: {
    title: "PokeCenter - O seu Centro Pokémon",
    description: "Capture, gerencie e compartilhe seus Pokémons favoritos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="grow p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
        <footer className="bg-poke-black text-poke-white p-4 text-center text-xs opacity-80 mt-auto border-t-4 border-poke-red">
          <p>© 2026 PokéCenter - Desenvolvido para Treinadores Pokémon</p>
        </footer>
      </body>
    </html>
  );
}
