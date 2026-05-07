# FeedMix MX — Sitio inicial

Software profesional de formulación de alimento balanceado para avicultura.
Producto de **TEC CAPITAL Group** — desarrollado por IPCI, Tehuacán, Puebla.

---

## 📦 Contenido del ZIP

```
feedmix-mx/
├── index.html              ← Landing pública
├── login.html              ← Login (email + Google)
├── registro.html           ← Registro con plan Pro/Despacho
├── panel.html              ← Dashboard del nutricionista
├── formulador.html         ← Pantalla principal (motor LP — mock por ahora)
├── ingredientes.html       ← Biblioteca editable (CRUD localStorage)
├── historial.html          ← Historial de fórmulas (empty state)
├── assets/
│   ├── shared.css          ← Sistema de diseño completo
│   ├── shared.js           ← Firebase init + helpers globales
│   └── firebase-config.js  ← ⚠️ EDITAR con tus credenciales reales
└── README.md               ← Este archivo
```

---

## 🚀 Pasos para desplegar

### 1. Crear proyecto Firebase

1. Ve a https://console.firebase.google.com
2. Click "Agregar proyecto" → nombre: **`feedmix-mx`**
3. Habilita **Authentication**:
   - Sign-in method → Email/Password ✅
   - Sign-in method → Google ✅
4. Habilita **Firestore Database**:
   - Modo: **producción**
   - Región: `us-central` o `southamerica-east1`
5. Project Settings (⚙️) → Tus apps → Web (`</>`) → registra app **"FeedMix MX Web"**
6. Copia los valores de `firebaseConfig` que te muestra

### 2. Editar `assets/firebase-config.js`

Reemplaza los placeholders con los valores reales que copiaste:

```javascript
window.FEEDMIX_FIREBASE_CONFIG = {
  apiKey: "AIzaSyXXX...",          // ← tu valor real
  authDomain: "feedmix-mx.firebaseapp.com",
  projectId: "feedmix-mx",
  storageBucket: "feedmix-mx.appspot.com",
  messagingSenderId: "1234567890",  // ← tu valor real
  appId: "1:1234:web:abcdef..."     // ← tu valor real
};
```

### 3. Subir a GitHub

```bash
# Crear repo nuevo en GitHub: teccapitalweb/feedmix-mx
cd feedmix-mx
git init
git add .
git commit -m "Initial commit: FeedMix MX MVP v0.1"
git branch -M main
git remote add origin https://github.com/teccapitalweb/feedmix-mx.git
git push -u origin main
```

### 4. Activar GitHub Pages

1. Repo → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main** / Folder: **/ (root)**
4. Save → en ~1 min estará en `https://teccapitalweb.github.io/feedmix-mx/`

### 5. Reglas de Firestore

En Firestore → Rules, pega esto:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cada nutricionista solo lee/escribe SU perfil
    match /nutricionistas/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Fórmulas: solo el dueño accede a las suyas
    match /formulas/{formulaId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    // Ingredientes propios del nutricionista
    match /ingredientes_propios/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. Dominios autorizados (Firebase Auth)

Authentication → Settings → Authorized domains → agregar:
- `teccapitalweb.github.io`
- `feedmix.mx` (cuando configures dominio propio)

---

## 🎨 Sistema de diseño

- **Estilo**: profesional médico tipo Doctoralia
- **Tipografía**: Plus Jakarta Sans (display + body) + JetBrains Mono (datos numéricos)
- **Paleta**:
  - Primary `#1B4D7C` (azul profesional)
  - Accent `#F59E0B` (ámbar premium)
  - Success `#10B981` / Danger `#EF4444`
- **Componentes**: cards con sombras sutiles, botones con elevación, mucho espacio en blanco

Todos los estilos están en `assets/shared.css` con variables CSS — fácil de personalizar.

---

## 📋 Estado actual del producto

### ✅ Listo en este drop
- Landing pública profesional con hero, features, planes, testimonios
- Login + registro con Email/Password y Google OAuth
- Dashboard del nutricionista con stats, accesos rápidos, banner de bienvenida
- Pantalla de formulador con setup de lote, biblioteca de ingredientes, panel de resultados
- Biblioteca de ingredientes con CRUD (localStorage por ahora; Firestore en v2)
- Historial con empty state y filtros
- Responsive mobile-first
- WhatsApp flotante en landing

### ⏳ Pendiente para próximos drops
- **v0.2**: integrar `glpk.js` real (programación lineal de mínimo costo) — reemplaza el mock del botón Optimizar
- **v0.3**: generador PDF con `jsPDF` (con marca blanca para plan Despacho)
- **v0.4**: CRUD ingredientes en Firestore (sustituye localStorage)
- **v0.5**: Webhook Shopify en Railway (`feedmix-webhook`) para activar planes Pro/Despacho
- **v0.6**: Tablas NRC reales para Cobb 500, Ross 308, Hy-Line W-36/Brown
- **v0.7**: Capacitación 1:1 con beta testers (AgroTec América + coordinador IngAvicola)

---

## 📞 Contacto técnico

- **Dev**: Jorge / TEC CAPITAL Group
- **WhatsApp soporte**: +52 238 147 8840
- **Email**: contacto@feedmix.mx (configurar luego)
- **Repo**: github.com/teccapitalweb/feedmix-mx (a crear)

---

© 2026 FeedMix MX · Producto de TEC CAPITAL Group · Tehuacán, Puebla, México
