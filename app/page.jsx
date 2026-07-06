'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [playersRes, configRes] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/config'),
      ]);

      if (playersRes.ok) setPlayers(await playersRes.json());
      if (configRes.ok) setConfig(await configRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  const totalJugadores = players.length;
  const totalAbonado = players.reduce((sum, p) => sum + (p.abonado || 0), 0);
  const deuda = config ? (totalJugadores * config.precioUniforme - totalAbonado) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      <HeroCarousel />

      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-5xl mb-2">
          ⚾ <span className="font-lobster text-dorado-claro">Bienvenido a Bravos</span>
        </h1>
        <p className="font-anton uppercase tracking-[2px] text-slate-400 text-lg">Gestión del equipo Bravos de Zipaquirá</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-xl p-6 border border-borde hover:border-dorado transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-dorado-claro text-sm font-anton uppercase tracking-wide">Total de Jugadores</h3>
            <Users className="text-dorado" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">{totalJugadores}</p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-borde hover:border-verde transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-verde text-sm font-anton uppercase tracking-wide">Total Abonado</h3>
            <TrendingUp className="text-verde" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">${totalAbonado.toLocaleString('es-CO')}</p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-borde hover:border-rojo transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-rojo text-sm font-anton uppercase tracking-wide">Deuda Total</h3>
            <TrendingUp className="text-rojo" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">${deuda.toLocaleString('es-CO')}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Users size={28} className="text-amber-500" />
          Últimos Jugadores Registrados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.slice(0, 6).map((player) => (
            <div key={player.id} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600 hover:border-amber-500 transition-colors">
              <h3 className="font-bold text-white text-lg">{player.nombre}</h3>
              <p className="text-sm font-semibold text-amber-400 mt-1">{player.rol}</p>
              {player.posicion && (
                <p className="text-sm text-slate-300 mt-2">🥎 Posición: <span className="font-semibold">{player.posicion}</span></p>
              )}
              <p className="text-sm text-slate-400 mt-3 pt-3 border-t border-slate-600">
                💰 Abonado: <span className="text-amber-400 font-semibold">${player.abonado?.toLocaleString('es-CO')}</span> / ${config?.precioUniforme.toLocaleString('es-CO')}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
