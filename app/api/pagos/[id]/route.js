import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

const ADMIN_PIN = process.env.ADMIN_PIN || 'bravos2026';

function isAdmin(req) {
  return (req.headers.get('x-admin-pin') || '') === ADMIN_PIN;
}

export async function DELETE(req, { params }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'PIN de administrador inválido' }, { status: 401 });
    }

    const db = await getDb();
    await db.execute('DELETE FROM pagos WHERE id=?', [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
