'use client';

import { useEffect, useState } from 'react';

const POSICIONES_DEFENSA = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

export default function LineupPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      if (res.ok) {
        setPlayers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  // Construir lineup por posición
  const lineup = {};
  POSICIONES_DEFENSA.forEach((pos) => {
    lineup[pos] = players.find((p) => p.posicion === pos) || null;
  });

  // Orden de bateo
  const ordenBateo = players
    .filter((p) => p.orden_bateo)
    .sort((a, b) => parseInt(a.orden_bateo) - parseInt(b.orden_bateo));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
          Lineup del Equipo ⚾
        </h1>
        <p className="text-slate-400 text-lg">Alineamiento actual de los Bravos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alineamiento defensivo */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Posiciones Defensivas</h2>

          <div className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 rounded-xl p-8 mb-8 relative shadow-lg" style={{minHeight: '350px'}}>
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full absolute inset-0 opacity-20"
            >
              {/* Base del pitcher */}
              <circle cx="100" cy="50" r="5" fill="white" />
              {/* Home plate */}
              <polygon
                points="100,180 90,170 90,160 100,155 110,160 110,170"
                fill="white"
              />
              {/* Línea hacia primera base */}
              <line x1="100" y1="155" x2="150" y2="100" stroke="white" strokeWidth="0.5" />
              {/* Línea hacia tercera base */}
              <line x1="100" y1="155" x2="50" y2="100" stroke="white" strokeWidth="0.5" />
            </svg>

            <div className="relative z-10 space-y-2 text-sm">
              {POSICIONES_DEFENSA.map((pos) => {
                const player = lineup[pos];
                return (
                  <div key={pos} className="flex items-center justify-between">
                    <span className="font-semibold text-white w-10">{pos}</span>
                    <span className="text-amber-200">
                      {player ? player.nombre : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-sm text-slate-400">
            <p className="mb-2">Posiciones asignadas: {Object.values(lineup).filter(Boolean).length}/9</p>
            <div className="space-y-1">
              {Object.entries(lineup).map(([pos, player]) => (
                !player && <p key={pos} className="text-red-500">Falta: {pos}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Orden de bateo */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Orden de Bateo 🏏</h2>

          <div className="space-y-3">
            {ordenBateo.length > 0 ? (
              ordenBateo.map((player, idx) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg border border-slate-700 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {player.orden_bateo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {player.nombre}
                    </p>
                    <p className="text-sm text-slate-400">
                      {player.posicion ? `${player.posicion}` : 'Sin posición'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">
                Sin orden de bateo definido
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700 text-sm text-slate-400">
            <p>Jugadores asignados: {ordenBateo.length}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Estadísticas del Equipo 📊</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg p-6 border border-purple-800 hover:border-purple-600 transition-colors">
            <p className="text-purple-300 text-sm mb-2 font-semibold uppercase tracking-wide">Total de Jugadores</p>
            <p className="text-4xl font-bold text-white">{players.length}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-900 to-cyan-950 rounded-lg p-6 border border-cyan-800 hover:border-cyan-600 transition-colors">
            <p className="text-cyan-300 text-sm mb-2 font-semibold uppercase tracking-wide">Con Posición Defensiva</p>
            <p className="text-4xl font-bold text-white">
              {Object.values(lineup).filter(Boolean).length}/9
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 rounded-lg p-6 border border-yellow-800 hover:border-yellow-600 transition-colors">
            <p className="text-yellow-300 text-sm mb-2 font-semibold uppercase tracking-wide">Con Turno al Bate</p>
            <p className="text-4xl font-bold text-white">{ordenBateo.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
