# ⚾ Bravos de Zipaquirá — App de gestión del equipo

Landing para gestionar el roster, posiciones defensivas, lineup de bateo y pagos de uniforme.

## Requisitos

Node.js 22.5 o superior (usa el SQLite integrado de Node, sin dependencias nativas).

## Cómo arrancar

```bash
cd bravos-zipaquira
npm install
npm start
```

Abre **http://localhost:3000** en el navegador.

## Funciones

- **Equipo**: los 15 integrantes ya vienen cargados. Cada uno puede tocar su foto para subir una imagen, y asignar su posición defensiva y turno al bate.
- **Campo**: diagrama del campo de béisbol con la miniatura de la foto de quien cubre cada posición. Toca una posición para asignarla. Cada posición solo puede tener un titular (se libera automáticamente la anterior).
- **Lineup**: orden de bateo 1–15, un jugador por turno.
- **Uniformes** ($120.000 c/u): tabla de cuánto ha abonado cada uno, cuánto falta, barra de progreso y estado (PAGADO/PARCIAL/PENDIENTE), más el historial de abonos. **Solo el administrador puede registrar o eliminar abonos.**

## PIN de administrador

El PIN por defecto es `bravos2026`. Cámbialo arrancando así:

```bash
ADMIN_PIN=miClaveSecreta npm start
```

## Datos

- Los datos (jugadores, posiciones, lineup, abonos) se guardan en **SQLite**: `data/bravos.db`.
- Las fotos se guardan por defecto en la carpeta `uploads/` del servidor.

## Fotos en Firebase (opcional)

Si prefieres que las fotos vivan en Firebase Storage:

1. Crea un proyecto en https://console.firebase.google.com
2. Activa **Storage** y ajusta las reglas de lectura/escritura
3. Copia la configuración web del proyecto en `public/firebase-config.js` (hay instrucciones dentro del archivo)

Con eso, las fotos se suben a Firebase automáticamente y solo la URL se guarda en SQLite. Si no configuras nada, todo sigue funcionando con almacenamiento local.

## Para que todo el equipo la use desde el celular

La app corre en tu computador; para compartirla con el equipo necesitas exponerla en internet. Opciones fáciles y gratuitas: [Railway](https://railway.app), [Render](https://render.com) o [Fly.io](https://fly.io) (sube esta carpeta como proyecto Node). También puedes probar rápido con `npx localtunnel --port 3000`.
