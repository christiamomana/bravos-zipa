import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

const ADMIN_PIN = process.env.ADMIN_PIN || 'bravos2026';

function isAdmin(req) {
  return (req.headers.get('x-admin-pin') || '') === ADMIN_PIN;
}

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.execute(`
      SELECT p.*, COALESCE(SUM(g.monto),0) AS abonado
      FROM players p LEFT JOIN pagos g ON g.player_id = p.id
      GROUP BY p.id
      ORDER BY COALESCE(p.orden_bateo, 999), p.id
    `);
    return NextResponse.json(result.rows || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'PIN de administrador inválido' }, { status: 401 });
    }

    const { nombre, numero = null, rol = 'JUGADOR' } = await req.json();
    if (!nombre) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 });

    const db = await getDb();
    const info = await db.execute('INSERT INTO players (nombre, numero, rol) VALUES (?,?,?)', [nombre.trim(), numero, rol]);
    return NextResponse.json({ id: info.lastInsertRowid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
