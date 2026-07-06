import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

const ADMIN_PIN = process.env.ADMIN_PIN || 'bravos2026';

function isAdmin(req) {
  return (req.headers.get('x-admin-pin') || '') === ADMIN_PIN;
}

export async function GET(req, { params }) {
  try {
    const db = await getDb();
    const result = await db.execute('SELECT * FROM players WHERE id=?', [params.id]);
    if (!result.rows?.length) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await getDb();
    const pResult = await db.execute('SELECT * FROM players WHERE id=?', [params.id]);
    const p = pResult.rows?.[0];
    if (!p) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });

    const body = await req.json();
    const fields = ['nombre', 'numero', 'rol', 'posicion', 'orden_bateo', 'foto_url'];
    const updates = {};
    for (const f of fields) if (f in body) updates[f] = body[f];
    if (!Object.keys(updates).length) return NextResponse.json({ ok: true });

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
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'PIN de administrador inválido' }, { status: 401 });
    }

    const db = await getDb();
    await db.execute('DELETE FROM pagos WHERE player_id=?', [params.id]);
    await db.execute('DELETE FROM players WHERE id=?', [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
