import { createClient } from '@libsql/client';

let db = null;

export async function getDb() {
  if (!db) {
    db = createClient({
      url: process.env.TURSO_CONNECTION_URL || 'libsql://bravos-zipa-christiamomana.aws-us-west-2.turso.io',
      authToken: process.env.TURSO_AUTH_TOKEN
    });

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
  }
  return db;
}
