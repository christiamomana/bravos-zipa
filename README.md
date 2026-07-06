# Bravos de Zipaquirá ⚾

Sistema de gestión del equipo Bravos de Zipaquirá - Roster, Lineup, Posiciones y Pagos de Uniforme.

## Características

- 📋 **Sesión de Jugadores**: Cada jugador puede:
  - Subir su propia foto
  - Asignar su posición defensiva (P, C, 1B, 2B, 3B, SS, LF, CF, RF, DH, BE)
  - Asignar su turno al bate (1º a 10º)

- ⚾ **Lineup**: Visualización en tiempo real de:
  - Alineamiento defensivo del equipo
  - Orden de bateo
  - Estadísticas del equipo

- 📊 **Dashboard**: Estadísticas principales:
  - Total de jugadores
  - Total abonado para uniformes
  - Deuda total del equipo

- 💾 **Base de Datos**: Almacenado en Turso (SQLite en la nube)

## Tech Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS
- **Database**: Turso (LibSQL)
- **Deployment**: Vercel

## Instalación Local

\`\`\`bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
\`\`\`

## Desplegar en Vercel

### 1. Hacer commit

\`\`\`bash
git add .
git commit -m "Implementar interfaz con Tailwind y funcionalidades"
git push -u origin main
\`\`\`

### 2. Conectar a Vercel

1. Ve a vercel.com
2. Conecta tu repositorio GitHub
3. Selecciona bravos-zipa

### 3. Variables de Entorno

\`\`\`
TURSO_CONNECTION_URL=libsql://bravos-zipa-christiamomana.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=<tu_token>
ADMIN_PIN=bravos2026
\`\`\`

### 4. Deploy

¡Vercel lo hará automáticamente!
