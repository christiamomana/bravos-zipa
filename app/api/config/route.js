import { NextResponse } from 'next/server';

const PRECIO_UNIFORME = 120000;

export async function GET() {
  return NextResponse.json({ precioUniforme: PRECIO_UNIFORME });
}
