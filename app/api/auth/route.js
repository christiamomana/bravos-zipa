import { NextResponse } from 'next/server';

const ADMIN_PIN = process.env.ADMIN_PIN || 'bravos2026';

export async function POST(req) {
  const { pin } = await req.json();
  if ((pin || '') === ADMIN_PIN) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false, error: 'PIN incorrecto' }, { status: 401 });
}
