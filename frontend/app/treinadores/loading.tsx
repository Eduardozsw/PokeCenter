import { RefreshCcw } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <RefreshCcw className="animate-spin text-poke-red" size={48} />
      <p className="font-retro animate-pulse text-sm text-poke-black">
        CONECTANDO AO HALL DA FAMA...
      </p>
    </div>
  );
}
