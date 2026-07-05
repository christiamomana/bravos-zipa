// Bravos de Zipaquirá — Servidor de gestión del equipo
require('dotenv').config();

const express = require('express');
const { createClient } = require('@libsql/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || 'bravos2026';
const PRECIO_UNIFORME = 120000;

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL || 'libsql://bravos-zipa-christiamomana.aws-us-west-2.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
});

const initDb = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      numero INTEGER,
      rol TEXT DEFAULT 'JUGADOR',
      posicion TEXT,
      orden_bateo INTEGER,
      foto_url TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      monto INTEGER NOT NULL,
      nota TEXT,
      fecha TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `);

  const result = await db.execute('SELECT COUNT(*) AS c FROM players');
  const count = result.rows[0]?.c || 0;
  if (count === 0) {
    const seed = [
      ['Luis Iriarte', 'JUGADOR', null],
      ['Jesús Silva', 'JUGADOR', null],
      ['Robertas Salas', 'JUGADOR', null],
      ['José Terán', 'JUGADOR', null],
      ['Johandri Parada', 'JUGADOR', null],
      ['Erickson López', 'JUGADOR', null],
      ['Kevin Torres', 'JUGADOR', null],
      ['Cristian Omaña', 'JUGADOR', null],
      ['Manuel González', 'CAPITAN', null],
      ['Alexis Jesús Valles', 'JUGADOR', null],
      ['Johandri', 'JUGADOR', '3B'],
      ['Carlos', 'JUGADOR', null],
      ['Agustín Meléndez', 'MANAGER', null],
      ['Alexis Valles', 'MANAGER', null],
      ['David', 'JUGADOR', 'C']
    ];
    for (const [nombre, rol, posicion] of seed) {
      await db.execute('INSERT INTO players (nombre, rol, posicion) VALUES (?,?,?)', [nombre, rol, posicion]);
    }
  }
};

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// ---- Multer para fotos locales ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    cb(null, `player_${req.params.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype))
});

// ---- Helpers ----
const isAdmin = req => (req.headers['x-admin-pin'] || '') === ADMIN_PIN;
const requireAdmin = (req, res, next) =>
  isAdmin(req) ? next() : res.status(401).json({ error: 'PIN de administrador inválido' });

const playersWithTotals = async () => {
  const result = await db.execute(`
    SELECT p.*, COALESCE(SUM(g.monto),0) AS abonado
    FROM players p LEFT JOIN pagos g ON g.player_id = p.id
    GROUP BY p.id
    ORDER BY COALESCE(p.orden_bateo, 999), p.id
  `);
  return result.rows || [];
};

// ---- API ----
app.get('/api/config', (req, res) => res.json({ precioUniforme: PRECIO_UNIFORME }));

app.post('/api/auth', (req, res) => {
  if ((req.body.pin || '') === ADMIN_PIN) return res.json({ ok: true });
  res.status(401).json({ ok: false, error: 'PIN incorrecto' });
});

app.get('/api/players', async (req, res) => {
  try {
    const players = await playersWithTotals();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/players', requireAdmin, async (req, res) => {
  try {
    const { nombre, numero = null, rol = 'JUGADOR' } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Falta el nombre' });
    const info = await db.execute('INSERT INTO players (nombre, numero, rol) VALUES (?,?,?)', [nombre.trim(), numero, rol]);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/players/:id', async (req, res) => {
  try {
    const pResult = await db.execute('SELECT * FROM players WHERE id=?', [req.params.id]);
    const p = pResult.rows?.[0];
    if (!p) return res.status(404).json({ error: 'Jugador no encontrado' });

    const fields = ['nombre', 'numero', 'rol', 'posicion', 'orden_bateo', 'foto_url'];
    const updates = {};
    for (const f of fields) if (f in req.body) updates[f] = req.body[f];
    if (!Object.keys(updates).length) return res.json({ ok: true });

    if (updates.posicion && updates.posicion !== 'BE' && updates.posicion !== 'DH') {
      await db.execute('UPDATE players SET posicion=NULL WHERE posicion=? AND id<>?', [updates.posicion, p.id]);
    }
    if (updates.orden_bateo) {
      await db.execute('UPDATE players SET orden_bateo=NULL WHERE orden_bateo=? AND id<>?', [updates.orden_bateo, p.id]);
    }
    const setSql = Object.keys(updates).map(k => `${k}=?`).join(', ');
    const values = Object.values(updates).map(v => v === undefined ? null : v);
    values.push(p.id);
    await db.execute(`UPDATE players SET ${setSql} WHERE id=?`, values);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/players/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM pagos WHERE player_id=?', [req.params.id]);
    await db.execute('DELETE FROM players WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subida local de foto (fallback si no hay Firebase)
app.post('/api/players/:id/foto', upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
    const url = `/uploads/${req.file.filename}`;
    await db.execute('UPDATE players SET foto_url=? WHERE id=?', [url, req.params.id]);
    res.json({ foto_url: url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Pagos (solo admin escribe) ----
app.get('/api/pagos', async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT g.*, p.nombre FROM pagos g JOIN players p ON p.id=g.player_id
      ORDER BY g.fecha DESC, g.id DESC
    `);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pagos', requireAdmin, async (req, res) => {
  try {
    const { player_id, monto, nota = null } = req.body;
    if (!player_id || !monto || monto <= 0)
      return res.status(400).json({ error: 'Datos de abono inválidos' });
    const info = await db.execute('INSERT INTO pagos (player_id, monto, nota) VALUES (?,?,?)', [player_id, Math.round(monto), nota]);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/pagos/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM pagos WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`⚾ Bravos de Zipaquirá corriendo en http://localhost:${PORT}`);
      console.log(`   PIN admin: ${ADMIN_PIN === 'bravos2026' ? 'bravos2026 (cámbialo con la variable ADMIN_PIN)' : '(definido por variable de entorno)'}`);
      console.log(`   Base de datos: Turso`);
    });
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
  }
};

startServer();
