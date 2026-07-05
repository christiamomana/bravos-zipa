// ==========================================================
// CONFIGURACIÓN DE FIREBASE (OPCIONAL — para guardar fotos)
// ==========================================================
// Si dejas este objeto vacío, las fotos se guardan en el
// servidor local (carpeta /uploads). Para usar Firebase:
//
// 1. Entra a https://console.firebase.google.com y crea un proyecto
// 2. Activa "Storage" (plan Spark es gratuito)
// 3. En Configuración del proyecto > Tus apps > Web, copia el
//    objeto firebaseConfig y pégalo abajo
// 4. En Storage > Rules, permite lectura/escritura según necesites
//
// window.FIREBASE_CONFIG = {
//   apiKey: "...",
//   authDomain: "tu-proyecto.firebaseapp.com",
//   projectId: "tu-proyecto",
//   storageBucket: "tu-proyecto.appspot.com",
//   messagingSenderId: "...",
//   appId: "..."
// };

window.FIREBASE_CONFIG = null;
