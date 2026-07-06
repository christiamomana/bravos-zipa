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
      SELECT g.*, p.nombre FROM pagos g JOIN players p ON p.id=g.player_id
      ORDER BY g.fecha DESC, g.id DESC
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

    const { player_id, monto, nota = null } = await req.json();
    if (!player_id || !monto || monto <= 0)
      return NextResponse.json({ error: 'Datos de abono inválidos' }, { status: 400 });

    const db = await getDb();
    const info = await db.execute('INSERT INTO pagos (player_id, monto, nota) VALUES (?,?,?)', [player_id, Math.round(monto), nota]);
    return NextResponse.json({ id: info.lastInsertRowid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
