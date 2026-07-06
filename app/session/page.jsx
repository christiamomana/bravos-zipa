'use client';

import { useEffect, useState } from 'react';
import { Upload, Save } from 'lucide-react';

const POSICIONES_DEFENSA = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'BE'];
const POSICIONES_BATEO = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

export default function SessionPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const startEditing = (player) => {
    setEditingId(player.id);
    setEditData({
      posicion: player.posicion || '',
      orden_bateo: player.orden_bateo || '',
    });
    setPhotoFile(null);
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files?.[0] || null);
  };

  const handleSave = async () => {
    if (!editingId) return;

    setSaving(true);
    try {
      let foto_url = null;

      if (photoFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          foto_url = reader.result;

          const updateRes = await fetch(`/api/players/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...editData,
              foto_url,
            }),
          });

          if (updateRes.ok) {
            setEditingId(null);
            setPhotoFile(null);
            loadPlayers();
          } else {
            alert('Error al guardar cambios');
          }
          setSaving(false);
        };
        reader.readAsDataURL(photoFile);
      } else {
        const updateRes = await fetch(`/api/players/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        });

        if (updateRes.ok) {
          setEditingId(null);
          loadPlayers();
        } else {
          alert('Error al guardar cambios');
        }
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
          Sesión de Jugadores
        </h1>
        <p className="text-slate-400 text-lg">Actualiza tu información, foto, posición y turno al bate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
          >
            {/* Foto */}
            <div className="relative bg-slate-900 h-48 flex items-center justify-center overflow-hidden">
              {player.foto_url ? (
                <img
                  src={player.foto_url}
                  alt={player.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-500">
                  <p>Sin foto</p>
                </div>
              )}
            </div>

            {/* Información */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-1">{player.nombre}</h3>
              <p className="text-sm text-amber-500 mb-3">{player.rol}</p>

              {editingId === player.id ? (
                <div className="space-y-3 mb-4">
                  {/* Upload foto */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Foto:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-300 text-sm"
                    />
                    {photoFile && (
                      <p className="text-xs text-green-500 mt-1">✓ Foto seleccionada</p>
                    )}
                  </div>

                  {/* Posición defensa */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Posición de Defensa:</label>
                    <select
                      value={editData.posicion}
                      onChange={(e) =>
                        setEditData({ ...editData, posicion: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-300"
                    >
                      <option value="">Seleccionar...</option>
                      {POSICIONES_DEFENSA.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Posición bateo */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Turno al Bate:
                    </label>
                    <select
                      value={editData.orden_bateo}
                      onChange={(e) =>
                        setEditData({ ...editData, orden_bateo: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-300"
                    >
                      <option value="">Seleccionar...</option>
                      {POSICIONES_BATEO.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}º turno
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-600 disabled:to-slate-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Save size={16} />
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      disabled={saving}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4 text-sm">
                    {player.posicion && (
                      <div>
                        <p className="text-slate-400">Defensa:</p>
                        <p className="text-white font-semibold text-lg">
                          {player.posicion}
                        </p>
                      </div>
                    )}
                    {player.orden_bateo && (
                      <div>
                        <p className="text-slate-400">Turno al Bate:</p>
                        <p className="text-white font-semibold text-lg">
                          {player.orden_bateo}º
                        </p>
                      </div>
                    )}
                    {!player.posicion && !player.orden_bateo && (
                      <p className="text-slate-500 text-xs italic">
                        Sin información aún
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => startEditing(player)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    Editar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
