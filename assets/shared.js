// ============================================
// FeedMix MX — Shared JS
// Modo HÍBRIDO: usa Firebase si está configurado,
// localStorage como fallback (modo demo) si no.
// ============================================

const cfg = window.FEEDMIX_FIREBASE_CONFIG || {};
const IS_DEMO = !cfg.apiKey || cfg.apiKey === "TU_API_KEY" || cfg.apiKey.length < 10;

window.FM_IS_DEMO = IS_DEMO;

if (IS_DEMO) {
  console.log("%c🟡 FeedMix MX — Modo DEMO activo", "background:#FEF3C7;color:#92400E;padding:6px 12px;border-radius:6px;font-weight:bold;");
  console.log("Datos guardados en localStorage. Configura Firebase en assets/firebase-config.js para producción.");
} else {
  console.log("%c🟢 FeedMix MX — Firebase activo", "background:#D1FAE5;color:#065F46;padding:6px 12px;border-radius:6px;font-weight:bold;");
}

// ============================================
// MODO DEMO: Mock auth + Firestore con localStorage
// ============================================

if (IS_DEMO) {

  // Cuenta demo precargada (primera vez)
  const seedUsers = JSON.parse(localStorage.getItem("fm_users") || "{}");
  if (!seedUsers["demo@feedmix.mx"]) {
    seedUsers["demo@feedmix.mx"] = {
      uid: "demo_seed_001",
      email: "demo@feedmix.mx",
      password: "demo123",
      displayName: "Demo FeedMix"
    };
    localStorage.setItem("fm_users", JSON.stringify(seedUsers));

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);
    localStorage.setItem("fm_nutricionistas/demo_seed_001", JSON.stringify({
      uid: "demo_seed_001",
      email: "demo@feedmix.mx",
      firstName: "Demo",
      lastName: "FeedMix",
      profession: "MVZ Nutricionista",
      company: "FeedMix Demo",
      plan: "pro",
      status: "trial",
      trialEnd: trialEnd.toISOString(),
      createdAt: new Date().toISOString(),
      formulasCount: 0
    }));
  }

  let currentUser = JSON.parse(localStorage.getItem("fm_current_user")) || null;
  const authListeners = [];

  function notifyAuth() {
    authListeners.forEach(cb => { try { cb(currentUser); } catch(e){} });
  }

  // Auth API
  window.fmAuth = {
    get currentUser() { return currentUser; }
  };

  // Firestore mocks
  window.fmDb = { _mock: true };

  window.fmFirebase = {

    // ====== AUTH ======
    onAuthStateChanged(_auth, callback) {
      authListeners.push(callback);
      setTimeout(() => callback(currentUser), 0);
      return () => {};
    },

    signInWithEmailAndPassword(_auth, email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem("fm_users") || "{}");
          const u = users[email];
          if (!u) {
            const e = new Error("No existe usuario"); e.code = "auth/user-not-found"; return reject(e);
          }
          if (u.password !== password) {
            const e = new Error("Contraseña incorrecta"); e.code = "auth/wrong-password"; return reject(e);
          }
          currentUser = { uid: u.uid, email: u.email, displayName: u.displayName || "" };
          localStorage.setItem("fm_current_user", JSON.stringify(currentUser));
          notifyAuth();
          resolve({ user: currentUser });
        }, 400);
      });
    },

    createUserWithEmailAndPassword(_auth, email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem("fm_users") || "{}");
          if (users[email]) {
            const e = new Error("Email en uso"); e.code = "auth/email-already-in-use"; return reject(e);
          }
          if (password.length < 6) {
            const e = new Error("Contraseña débil"); e.code = "auth/weak-password"; return reject(e);
          }
          const uid = "demo_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
          users[email] = { uid, email, password, displayName: "" };
          localStorage.setItem("fm_users", JSON.stringify(users));
          currentUser = { uid, email, displayName: "" };
          localStorage.setItem("fm_current_user", JSON.stringify(currentUser));
          notifyAuth();
          resolve({ user: currentUser });
        }, 600);
      });
    },

    GoogleAuthProvider: class GoogleAuthProvider {
      constructor() { this.providerId = "google.com"; }
    },

    signInWithPopup(_auth, _provider) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simular Google sign-in con cuenta demo
          const email = "google.demo@feedmix.mx";
          const users = JSON.parse(localStorage.getItem("fm_users") || "{}");
          if (!users[email]) {
            users[email] = {
              uid: "google_demo_001",
              email,
              password: null,
              displayName: "Usuario Google Demo"
            };
            localStorage.setItem("fm_users", JSON.stringify(users));
          }
          const u = users[email];
          currentUser = { uid: u.uid, email: u.email, displayName: u.displayName };
          localStorage.setItem("fm_current_user", JSON.stringify(currentUser));
          notifyAuth();
          resolve({ user: currentUser });
        }, 800);
      });
    },

    signOut(_auth) {
      currentUser = null;
      localStorage.removeItem("fm_current_user");
      notifyAuth();
      return Promise.resolve();
    },

    updateProfile(user, data) {
      Object.assign(user, data);
      const users = JSON.parse(localStorage.getItem("fm_users") || "{}");
      if (users[user.email]) {
        Object.assign(users[user.email], data);
        localStorage.setItem("fm_users", JSON.stringify(users));
      }
      currentUser = user;
      localStorage.setItem("fm_current_user", JSON.stringify(currentUser));
      return Promise.resolve();
    },

    sendPasswordResetEmail(_auth, email) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`[MODO DEMO] Email de recuperación simulado a ${email}`);
          resolve();
        }, 600);
      });
    },

    // ====== FIRESTORE ======
    doc(_db, ...path) {
      return { _path: path.join("/"), _isDoc: true };
    },

    getDoc(ref) {
      return new Promise((resolve) => {
        const raw = localStorage.getItem(`fm_${ref._path}`);
        const data = raw ? JSON.parse(raw) : null;
        // Convertir strings ISO a "Timestamp-like" con .toDate()
        if (data && data.trialEnd && typeof data.trialEnd === "string") {
          const d = new Date(data.trialEnd);
          data.trialEnd = { toDate: () => d };
        }
        if (data && data.createdAt && typeof data.createdAt === "string") {
          const d = new Date(data.createdAt);
          data.createdAt = { toDate: () => d };
        }
        resolve({
          exists: () => data !== null,
          data: () => data,
          id: ref._path.split("/").pop()
        });
      });
    },

    setDoc(ref, data) {
      const out = { ...data };
      if (out.trialEnd instanceof Date) out.trialEnd = out.trialEnd.toISOString();
      if (out.createdAt && typeof out.createdAt === "object" && out.createdAt._serverTs) out.createdAt = new Date().toISOString();
      localStorage.setItem(`fm_${ref._path}`, JSON.stringify(out));
      return Promise.resolve();
    },

    updateDoc(ref, data) {
      const existing = JSON.parse(localStorage.getItem(`fm_${ref._path}`) || "{}");
      const merged = { ...existing, ...data };
      localStorage.setItem(`fm_${ref._path}`, JSON.stringify(merged));
      return Promise.resolve();
    },

    deleteDoc(ref) {
      localStorage.removeItem(`fm_${ref._path}`);
      return Promise.resolve();
    },

    collection(_db, name) {
      return { _name: name, _isCollection: true };
    },

    addDoc(colRef, data) {
      const id = "doc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      const out = { ...data, id };
      if (out.createdAt && typeof out.createdAt === "object" && out.createdAt._serverTs) out.createdAt = new Date().toISOString();

      // Guardar en colección
      const colKey = `fm_col_${colRef._name}`;
      const existing = JSON.parse(localStorage.getItem(colKey) || "[]");
      existing.push(out);
      localStorage.setItem(colKey, JSON.stringify(existing));
      return Promise.resolve({ id });
    },

    getDocs(qOrRef) {
      return new Promise((resolve) => {
        const colName = qOrRef._name || qOrRef._colName;
        const items = JSON.parse(localStorage.getItem(`fm_col_${colName}`) || "[]");
        // Filtrar si hay where
        let filtered = items;
        if (qOrRef._filters) {
          qOrRef._filters.forEach(f => {
            filtered = filtered.filter(it => it[f.field] === f.value);
          });
        }
        resolve({
          docs: filtered.map(it => ({
            id: it.id,
            data: () => {
              const d = { ...it };
              if (d.createdAt && typeof d.createdAt === "string") {
                const dt = new Date(d.createdAt);
                d.createdAt = { toDate: () => dt };
              }
              return d;
            }
          })),
          forEach(cb) { this.docs.forEach(cb); },
          empty: filtered.length === 0,
          size: filtered.length
        });
      });
    },

    query(ref, ...constraints) {
      const filters = [];
      constraints.forEach(c => { if (c._where) filters.push(c._where); });
      return { _colName: ref._name, _filters: filters };
    },

    where(field, op, value) {
      return { _where: { field, op, value } };
    },

    orderBy(_field, _dir) {
      return { _orderBy: true };
    },

    serverTimestamp() {
      return { _serverTs: true };
    }
  };

}

// ============================================
// MODO PRODUCCIÓN: Firebase real
// ============================================

else {

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
    const fbAuth = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    const fbStore = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const app = initializeApp(cfg);
    window.fmAuth = fbAuth.getAuth(app);
    window.fmDb = fbStore.getFirestore(app);

    window.fmFirebase = {
      onAuthStateChanged: fbAuth.onAuthStateChanged,
      signInWithEmailAndPassword: fbAuth.signInWithEmailAndPassword,
      createUserWithEmailAndPassword: fbAuth.createUserWithEmailAndPassword,
      GoogleAuthProvider: fbAuth.GoogleAuthProvider,
      signInWithPopup: fbAuth.signInWithPopup,
      signOut: fbAuth.signOut,
      updateProfile: fbAuth.updateProfile,
      sendPasswordResetEmail: fbAuth.sendPasswordResetEmail,
      doc: fbStore.doc,
      getDoc: fbStore.getDoc,
      setDoc: fbStore.setDoc,
      updateDoc: fbStore.updateDoc,
      deleteDoc: fbStore.deleteDoc,
      collection: fbStore.collection,
      addDoc: fbStore.addDoc,
      getDocs: fbStore.getDocs,
      query: fbStore.query,
      where: fbStore.where,
      orderBy: fbStore.orderBy,
      serverTimestamp: fbStore.serverTimestamp
    };

    console.log("%c🟢 FeedMix MX — Firebase conectado y listo", "background:#D1FAE5;color:#065F46;padding:6px 12px;border-radius:6px;font-weight:bold;");

  } catch (err) {
    console.error("❌ Error al inicializar Firebase:", err);
    console.warn("⚠️ Verifica: 1) Conexión a internet, 2) Dominio autorizado en Firebase Auth, 3) Credenciales en firebase-config.js");
    // Mostrar toast amigable al usuario si la función ya cargó
    if (typeof window.fmToast === "function") {
      window.fmToast("Error de conexión con Firebase. Verifica tu internet o contacta soporte.", "error");
    }
    // Re-throw para que las páginas que dependen de Firebase puedan manejarlo
    throw err;
  }

}

// ============================================
// API PÚBLICA COMÚN (igual en demo y producción)
// ============================================

window.fmAuthGuard = function(opts = {}) {
  const { requireAuth = true, redirectIfAuth = null } = opts;
  return new Promise((resolve) => {
    let resolved = false;
    window.fmFirebase.onAuthStateChanged(window.fmAuth, async (user) => {
      if (resolved) return;

      // ⚡ MODO DEMO: si la página requiere auth y no hay sesión,
      // auto-login con cuenta demo (sin redirigir al login)
      if (requireAuth && !user && IS_DEMO) {
        try {
          await window.fmFirebase.signInWithEmailAndPassword(
            window.fmAuth, "demo@feedmix.mx", "demo123"
          );
          // El listener se dispara de nuevo con el user logueado, ahí resolvemos
          return;
        } catch (e) {
          console.error("Auto-login demo falló:", e);
        }
      }

      if (requireAuth && !user) {
        window.location.href = "login.html";
        return;
      }

      // ============================================
      // Si HAY usuario, SIEMPRE asegurar perfil ANTES de redirigir o resolver
      // ============================================
      // Esto cubre el caso de Google Sign-In: si el usuario autentica con Google
      // pero no tenía cuenta previa (no pasó por registro.html), su doc en
      // Firestore no existe. Lo creamos automáticamente aquí.
      if (user) {
        try {
          const ref = window.fmFirebase.doc(window.fmDb, "nutricionistas", user.uid);
          const snap = await window.fmFirebase.getDoc(ref);
          if (!snap.exists()) {
            // Crear perfil automáticamente para usuarios nuevos (especialmente Google)
            const displayName = user.displayName || "";
            const nameParts = displayName.split(" ");
            await window.fmFirebase.setDoc(ref, {
              uid: user.uid,
              email: user.email || "",
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              profession: "",
              company: "",
              status: "exploration",
              createdAt: window.fmFirebase.serverTimestamp(),
              formulasCount: 0
            });
            console.log("✅ Perfil creado automáticamente para usuario nuevo:", user.email);
            // Re-leer para obtener los datos
            const newSnap = await window.fmFirebase.getDoc(ref);
            window.fmProfile = newSnap.exists() ? newSnap.data() : null;
          } else {
            window.fmProfile = snap.data();
          }
        } catch (e) {
          console.warn("No se pudo cargar/crear perfil:", e);
          window.fmProfile = null;
        }
        // Calcular acceso centralizado
        window.fmAccess = window.fmComputeAccess(window.fmProfile);
      }

      // Después de crear/cargar perfil, redirigir si corresponde
      if (redirectIfAuth && user) {
        window.location.href = redirectIfAuth;
        return;
      }

      resolved = true;
      resolve(user);
    });
  });
};

// ============================================
// SISTEMA DE ACCESO CENTRALIZADO (paywall)
// ============================================
// Calcula los permisos del usuario según su perfil en Firestore.
// Modelo de status: "trial" | "active" | "expired" | "cancelled"
// Modelo de plan: "pro" | "despacho"
// ============================================
window.fmComputeAccess = function(profile) {
  // Sin perfil = sin acceso (no debería pasar si está logueado)
  if (!profile) {
    return {
      status: "none",
      plan: null,
      hasAccess: false,
      isTrial: false,
      isPaid: false,
      isExpired: true,
      daysLeft: 0,
      canCreateFormula: false,
      canSavePDF: false,
      canRemoveWatermark: false,
      canHaveMultipleUsers: false,
      formulasCount: 0,
      formulasLimit: 0,
      planLabel: "Sin acceso",
      statusLabel: "Sin perfil"
    };
  }

  const now = new Date();
  const status = profile.status || "trial";
  const plan = profile.plan || "pro";
  const formulasCount = profile.formulasCount || 0;

  // Convertir Firestore Timestamps a Date
  function toDate(v) {
    if (!v) return null;
    if (v.toDate) return v.toDate();
    if (v.seconds) return new Date(v.seconds * 1000);
    if (v instanceof Date) return v;
    return new Date(v);
  }

  const subscriptionEnd = toDate(profile.subscriptionEnd);

  // ¿El usuario actual es admin? Misma verificación que fmIsAdmin(): email ∈ FM_ADMIN_EMAILS
  // (reusa la lista, no la duplica). Los admins tienen acceso premium automático,
  // sin pagar ni canjear. El email se toma del perfil o, si no, del usuario autenticado.
  const adminEmail = (profile.email ||
                      (window.fmAuth && window.fmAuth.currentUser && window.fmAuth.currentUser.email) ||
                      "").toLowerCase();
  const isAdmin = !!adminEmail && Array.isArray(window.FM_ADMIN_EMAILS) &&
                  window.FM_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(adminEmail);

  // SIMPLIFICADO (sin trial): solo 2 estados
  // - PAGADO: status="active" y suscripción no expirada
  // - MODO EXPLORACIÓN: cualquier otro caso (incluye trial, sin pagar, expirado)
  const isPaidActive = status === "active" && (!subscriptionEnd || subscriptionEnd > now);

  // Acceso efectivo = pagado O admin. Para usuarios NO admin es idéntico a isPaidActive:
  // su lógica de pago/canje no cambia en absoluto.
  const access = isPaidActive || isAdmin;
  const isExpired = !access; // Para mantener compatibilidad

  // Días restantes (solo aplica para suscripción pagada real)
  let daysLeft = 0;
  let endDate = null;
  if (isPaidActive && subscriptionEnd) {
    daysLeft = Math.ceil((subscriptionEnd - now) / (1000 * 60 * 60 * 24));
    endDate = subscriptionEnd;
  }

  // Acceso: pagado o admin
  const hasAccess = access;

  // Límite de fórmulas: con acceso ilimitado, sin acceso = 0
  const formulasLimit = access ? Infinity : 0;

  // Labels para UI
  const planLabel = isAdmin ? "Admin" :
                    plan === "despacho" ? "Plan Despacho" :
                    plan === "lifetime" ? "Plan De por vida" :
                    plan === "anual" ? "Plan Anual" :
                    plan === "trimestral" ? "Plan Trimestral" : "Plan Profesional";
  let statusLabel;
  if (isAdmin) statusLabel = "Admin";
  else if (isPaidActive) statusLabel = plan === "lifetime" ? "De por vida ✓" : "Activa";
  else statusLabel = "Modo exploración";

  return {
    status: status,
    plan: plan,
    isAdmin: isAdmin,
    hasAccess: hasAccess,
    isTrial: false,           // YA NO HAY TRIAL — todos sin pagar = exploración
    isPaid: access,
    isExpired: isExpired,
    daysLeft: daysLeft,
    endDate: endDate,
    canCreateFormula: access,
    canSavePDF: access,
    canRemoveWatermark: access,
    canHaveMultipleUsers: (isPaidActive && plan === "despacho") || isAdmin,
    formulasCount: formulasCount,
    formulasLimit: formulasLimit,
    planLabel: planLabel,
    statusLabel: statusLabel
  };
};

// ============================================
// PRICING - FUENTE ÚNICA DE VERDAD
// ============================================
// 3 planes: Trimestral (3 meses) / Anual / Lifetime
// Trimestral y Lifetime son ONE-TIME PAYMENTS (no recurring)
// Anual es RECURRING (subscription anual)
// ============================================
// ============================================
// LISTA DE ADMINS — Acceso al panel admin
// ============================================
// Agrega aquí los emails que tienen acceso a admin.html
// Cualquier otro email será redirigido a panel.html
window.FM_ADMIN_EMAILS = [
  "sinergiaagricola789@gmail.com",
  "ipcilinstituto@gmail.com",
  "ipcilinstituto@ipcil.org",
  "pecuariavision62@gmail.com",
  "demo@feedmix.mx",
  "americaagrotec7@gmail.com",
  "teccapitalweb@gmail.com"
];

window.fmIsAdmin = function() {
  const user = window.fmAuth?.currentUser;
  if (!user || !user.email) return false;
  return window.FM_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase());
};

window.FM_PRICING = {
  trimestral: {
    nombre: "Trimestral",
    descripcion: "3 meses de acceso completo. Ideal para probar a fondo.",
    precio: 1399,
    moneda: "MXN",
    duracion: "3 meses",
    mode: "subscription", // every 3 months recurring
    badge: null,
    stripePriceId: "price_1TWgYRA7If2CqXs95er8a6ad",
    features: [
      "Fórmulas ilimitadas durante 3 meses",
      "179 etapas técnicas · 30 razas",
      "Aminograma completo (8 AA)",
      "Alertas inteligentes",
      "PDF profesional sin marca de agua",
      "Soporte por email + WhatsApp"
    ]
  },
  anual: {
    nombre: "Anual",
    descripcion: "12 meses de acceso. El favorito de los nutricionistas.",
    precio: 2499,
    moneda: "MXN",
    duracion: "1 año",
    mode: "subscription", // yearly recurring
    badge: "⭐ MÁS POPULAR",
    stripePriceId: "price_1TWgZUA7If2CqXs9TmNLis9i",
    features: [
      "Todo lo del plan Trimestral",
      "12 meses completos de acceso",
      "Ahorra 55% vs trimestral",
      "Soporte prioritario WhatsApp",
      "Actualizaciones incluidas",
      "Capacitación 1:1 incluida"
    ]
  },
  lifetime: {
    nombre: "De por vida",
    descripcion: "Pago único. Acceso para siempre, sin renovaciones.",
    precio: 3499,
    moneda: "MXN",
    duracion: "para siempre",
    mode: "payment", // ONE-TIME, no subscription
    badge: "🏆 MEJOR VALOR",
    stripePriceId: "price_1TWgaaA7If2CqXs9wqiOk33L",
    features: [
      "Todo lo del plan Anual",
      "Acceso de por vida sin renovar",
      "Todas las futuras actualizaciones",
      "Marca blanca en PDFs",
      "Soporte VIP de por vida",
      "Capacitación avanzada incluida"
    ]
  }
};

window.fmFormatMXN = function(amount) {
  return "$" + Number(amount).toLocaleString("es-MX") + " MXN";
};

window.fmLogout = async function() {
  await window.fmFirebase.signOut(window.fmAuth);
  window.location.href = "index.html";
};

// ============================================
// HELPERS UI
// ============================================

window.fmToast = function(message, type = "info") {
  const colors = { info: "#0EA5E9", success: "#10B981", danger: "#EF4444", warning: "#F59E0B" };
  const t = document.createElement("div");
  t.style.cssText = `
    position: fixed; top: 24px; right: 24px; z-index: 9999;
    background: white; border-left: 4px solid ${colors[type]};
    padding: 16px 20px; border-radius: 10px;
    box-shadow: 0 16px 40px rgba(15,52,87,.12);
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    color: #1E293B; max-width: 360px;
    animation: fmSlideIn .3s ease-out;
  `;
  t.textContent = message;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity .3s";
    setTimeout(() => t.remove(), 300);
  }, 3500);
};

const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes fmSlideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(styleEl);

// Banner de modo demo (sutil, en panel)
window.fmShowDemoBanner = function() {
  if (!IS_DEMO) return;
  if (document.getElementById("fmDemoBanner")) return;
  const b = document.createElement("div");
  b.id = "fmDemoBanner";
  b.style.cssText = `
    background: linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%);
    color: #78350F;
    padding: 8px 16px; text-align: center;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
    border-bottom: 1px solid #FCD34D;
    position: sticky; top: 0; z-index: 200;
    display: flex; align-items: center; justify-content: center; gap: 12px;
  `;
  b.innerHTML = `
    <span>🟡 <strong>Modo demo</strong> — Datos guardados localmente en tu navegador</span>
    <a href="index.html" style="color:#78350F;text-decoration:underline;font-weight:700;">Volver al inicio</a>
  `;
  document.body.insertBefore(b, document.body.firstChild);
};

// ============================================
// FORMATEADORES
// ============================================

window.fmCurrency = (n, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency, minimumFractionDigits: 2 }).format(n || 0);

window.fmNumber = (n, decimals = 2) =>
  new Intl.NumberFormat("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n || 0);

window.fmDate = (timestamp) => {
  if (!timestamp) return "—";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(d);
};

// ============================================
// AUTO-BANNER en páginas autenticadas (modo demo)
// ============================================

if (IS_DEMO) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoDemoBanner);
  } else {
    autoDemoBanner();
  }
}

function autoDemoBanner() {
  if (document.querySelector(".app-shell")) {
    window.fmShowDemoBanner();
  }
}

// ============================================
// BANNER DE PAYWALL (trial / expirado / pagado)
// ============================================
// Se inserta automáticamente cuando hay .app-shell y un usuario logueado
window.fmShowPaywallBanner = function() {
  const acc = window.fmAccess;
  if (!acc) return;
  if (document.getElementById("fmPaywallBanner")) return;

  const b = document.createElement("div");
  b.id = "fmPaywallBanner";

  let bgGrad, color, borderBottom, content;

  if (acc.isPaid) {
    // Plan activo - banner verde discreto
    bgGrad = "linear-gradient(90deg, #ECFDF5 0%, #D1FAE5 100%)";
    color = "#065F46";
    borderBottom = "#A7F3D0";
    content =
      '<span>✅ <strong>' + acc.planLabel + ' activo</strong>' +
      (acc.daysLeft > 0 && acc.plan !== "lifetime" ? ' · Renueva en ' + acc.daysLeft + ' días' : '') +
      (acc.plan === "lifetime" ? ' · Acceso permanente' : '') +
      '</span>';
  } else {
    // Modo exploración - banner ámbar con CTA
    bgGrad = "linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%)";
    color = "#78350F";
    borderBottom = "#FCD34D";
    content =
      '<span>🟡 <strong>Modo exploración</strong> · Activa tu plan para optimizar, guardar y descargar fórmulas</span>' +
      '<button onclick="window.fmShowUpgradeModal()" style="background:#B87333;color:white;border:none;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;">Activar plan</button>';
  }

  b.style.cssText =
    'background:' + bgGrad + ';' +
    'color:' + color + ';' +
    'padding: 8px 16px; text-align: center;' +
    "font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;" +
    'border-bottom: 1px solid ' + borderBottom + ';' +
    'position: sticky; top: 0; z-index: 200;' +
    'display: flex; align-items: center; justify-content: center; gap: 12px;';
  b.innerHTML = content;

  document.body.insertBefore(b, document.body.firstChild);
};

// Auto-insertar banner de paywall al cargar la página (si hay user logueado y .app-shell)
function autoPaywallBanner() {
  if (document.querySelector(".app-shell") && window.fmAccess) {
    window.fmShowPaywallBanner();
  }
}

// ============================================
// MODAL DE UPGRADE (paywall completo) — 3 PLANES
// ============================================
window.fmShowUpgradeModal = function(opts = {}) {
  const reason = opts.reason || "manual";
  if (document.getElementById("fmUpgradeModal")) return;

  const reasonMsg = {
    expired: "Tu prueba gratuita terminó. Activa tu plan para seguir formulando.",
    formulas: "Has alcanzado el límite de fórmulas de la prueba. Activa un plan para fórmulas ilimitadas.",
    watermark: "Quita la marca de agua activando cualquier plan de pago.",
    save: "Guarda tus fórmulas en la nube activando un plan.",
    manual: "Activa todo el poder de FeedMix MX."
  }[reason];

  const pricing = window.FM_PRICING;
  const plans = [
    { key: "trimestral", borderColor: "#E2E8F0", btnBg: "#3F4F2E", isFeatured: false },
    { key: "anual", borderColor: "#B87333", btnBg: "#3F4F2E", isFeatured: true },
    { key: "lifetime", borderColor: "#DC2626", btnBg: "#B87333", isFeatured: true }
  ];

  const modal = document.createElement("div");
  modal.id = "fmUpgradeModal";
  modal.style.cssText = `
    position: fixed; inset: 0; z-index: 9998;
    background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; overflow-y: auto;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: fmFadeIn 0.2s ease-out;
  `;

  function planCardHTML(planKey, isFeatured, borderColor, btnBg) {
    const p = pricing[planKey];
    const capitalized = planKey.charAt(0).toUpperCase() + planKey.slice(1);
    const bgGrad = isFeatured ? "linear-gradient(180deg,#FFFFFF 0%,#FFF7ED 100%)" : "white";
    const badgeHTML = p.badge
      ? '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:' + (planKey === "lifetime" ? "#DC2626" : "#B87333") + ';color:white;font-size:0.625rem;font-weight:800;letter-spacing:0.08em;padding:5px 12px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.2);">' + p.badge + '</div>'
      : '';
    const pagoUnicoBadge = p.mode === "payment"
      ? '<div style="display:inline-flex;align-items:center;gap:4px;background:rgba(220,38,38,0.1);color:#B91C1C;padding:3px 8px;border-radius:999px;font-size:0.625rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;width:fit-content;">💰 Pago único</div>'
      : '';
    return (
      '<div style="border:2px solid ' + borderColor + ';border-radius:12px;padding:24px 18px;display:flex;flex-direction:column;background:' + bgGrad + ';position:relative;">' +
        badgeHTML +
        '<div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;color:#B87333;margin-bottom:4px;text-transform:uppercase;">' + p.nombre + '</div>' +
        '<div style="color:#64748B;font-size:0.75rem;margin-bottom:14px;min-height:36px;">' + p.descripcion + '</div>' +
        '<div style="display:flex;align-items:baseline;gap:4px;margin-bottom:4px;">' +
          '<span style="font-size:0.875rem;color:#94A3B8;font-weight:600;">$</span>' +
          '<span style="font-size:2.25rem;font-weight:800;color:#0F172A;line-height:1;">' + p.precio.toLocaleString("es-MX") + '</span>' +
          '<span style="font-size:0.8125rem;color:#64748B;">MXN</span>' +
        '</div>' +
        '<div style="font-size:0.6875rem;color:#94A3B8;margin-bottom:8px;">' + p.duracion + '</div>' +
        pagoUnicoBadge +
        '<button id="btnUpgrade' + capitalized + '" onclick="window.fmStartCheckout(\'' + planKey + '\')" style="background:' + btnBg + ';color:white;border:none;padding:11px 14px;border-radius:8px;font-weight:700;font-size:0.875rem;cursor:pointer;margin-top:auto;margin-bottom:14px;">Activar ' + p.nombre + '</button>' +
        '<ul style="list-style:none;padding:0;margin:0;font-size:0.75rem;color:#475569;display:flex;flex-direction:column;gap:6px;">' +
          p.features.map(function(f){ return '<li style="display:flex;gap:6px;align-items:flex-start;"><span style="color:#10B981;font-weight:700;flex-shrink:0;">✓</span><span>' + f + '</span></li>'; }).join('') +
        '</ul>' +
      '</div>'
    );
  }

  modal.innerHTML = (
    '<div style="background:white;border-radius:16px;max-width:1080px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.3);">' +
      '<div style="background:linear-gradient(135deg,#3F4F2E 0%,#2A3520 100%);color:white;padding:28px 32px;border-radius:16px 16px 0 0;position:relative;">' +
        '<button onclick="document.getElementById(\'fmUpgradeModal\').remove()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,.15);color:white;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">×</button>' +
        '<div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;color:#D4925A;margin-bottom:6px;">ACTIVA FEEDMIX MX</div>' +
        '<h2 style="font-size:1.75rem;font-weight:800;margin:0 0 8px 0;line-height:1.2;">Elige el plan que mejor te convenga</h2>' +
        '<p style="opacity:0.85;margin:0;font-size:0.9375rem;line-height:1.5;">' + reasonMsg + '</p>' +
      '</div>' +
      '<div style="padding:36px 24px 20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">' +
        plans.map(function(p){ return planCardHTML(p.key, p.isFeatured, p.borderColor, p.btnBg); }).join('') +
      '</div>' +
      // --- Canje de código de cortesía ---
      '<div style="padding:0 24px 20px;">' +
        '<div style="border-top:1px dashed #E2E8F0;padding-top:18px;">' +
          '<div style="font-size:0.8125rem;font-weight:700;color:#3F4F2E;margin-bottom:8px;">🎟️ ¿Tienes un código de curso?</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<input id="fmRedeemInput" type="text" placeholder="XXXXX-XXXXX" autocomplete="off" spellcheck="false" maxlength="16" style="flex:1;min-width:170px;padding:10px 12px;border:1px solid #CBD5E1;border-radius:8px;font-family:ui-monospace,Menlo,Consolas,monospace;text-transform:uppercase;font-size:0.95rem;letter-spacing:0.08em;" />' +
            '<button id="fmRedeemBtn" type="button" style="background:#3F4F2E;color:white;border:none;padding:10px 20px;border-radius:8px;font-weight:700;font-size:0.875rem;cursor:pointer;">Canjear</button>' +
          '</div>' +
          '<div id="fmRedeemMsg" style="display:none;margin-top:8px;font-size:0.8125rem;padding:8px 12px;border-radius:8px;"></div>' +
        '</div>' +
      '</div>' +
      '<div style="padding:16px 32px;border-top:1px solid #F1F5F9;background:#F8FAFC;border-radius:0 0 16px 16px;text-align:center;font-size:0.75rem;color:#64748B;">' +
        '🔒 Pago seguro con Stripe · 💸 Garantía 14 días devolución · 🇲🇽 Precios en pesos mexicanos' +
      '</div>' +
    '</div>'
  );

  document.body.appendChild(modal);

  // Click fuera del card para cerrar
  modal.addEventListener("click", function(e) {
    if (e.target === modal) modal.remove();
  });

  // Responsive: 1 columna en mobile
  if (window.innerWidth < 720) {
    const grid = modal.querySelector('[style*="grid-template-columns:1fr 1fr 1fr"]');
    if (grid) grid.style.gridTemplateColumns = "1fr";
  } else if (window.innerWidth < 1024) {
    const grid = modal.querySelector('[style*="grid-template-columns:1fr 1fr 1fr"]');
    if (grid) grid.style.gridTemplateColumns = "1fr 1fr";
  }

  // Conectar el campo de canje del modal al backend
  window.fmAttachRedeem(
    modal.querySelector("#fmRedeemInput"),
    modal.querySelector("#fmRedeemBtn"),
    modal.querySelector("#fmRedeemMsg")
  );
};

// ============================================
// CHECKOUT CON STRIPE (3 planes: trimestral / anual / lifetime)
// ============================================
window.fmStartCheckout = async function(planKey) {
  const user = window.fmAuth?.currentUser;
  if (!user) {
    window.fmToast("Inicia sesión primero", "warning");
    return;
  }

  const plan = window.FM_PRICING[planKey];
  if (!plan || !plan.stripePriceId) {
    window.fmToast("Plan no válido", "danger");
    return;
  }

  // Mostrar loading
  const btn = document.getElementById("btnUpgrade" + planKey.charAt(0).toUpperCase() + planKey.slice(1));
  const originalText = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:fmSpin 0.8s linear infinite;"></span> Cargando...';
  }

  try {
    // ============ FIX BUG 1: limpiar checkout anterior ============
    // Si ya hay un checkout montado, destruirlo antes de crear otro
    // (Stripe NO permite múltiples Embedded Checkout objects simultáneamente)
    if (window._fmStripeCheckout) {
      try {
        window._fmStripeCheckout.destroy();
      } catch (e) { /* ignore */ }
      window._fmStripeCheckout = null;
    }
    document.getElementById("fmCheckoutModal")?.remove();

    const FM_WEBHOOK_URL = window.FM_WEBHOOK_URL || "https://feedmix-webhook-production.up.railway.app";

    const response = await fetch(FM_WEBHOOK_URL + "/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: plan.stripePriceId,
        plan: planKey,
        mode: plan.mode, // "subscription" o "payment" (lifetime es payment)
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || ""
      })
    });

    if (!response.ok) {
      // Intentar leer el error real del body
      let errBody = "";
      try {
        const errJson = await response.json();
        errBody = errJson.error || "";
      } catch(e) {}
      throw new Error("Error " + response.status + (errBody ? " - " + errBody : " al crear sesión de pago"));
    }

    const data = await response.json();
    if (!data.clientSecret) {
      throw new Error(data.error || "No se recibió clientSecret de Stripe");
    }

    // Cargar Stripe.js
    if (!window.Stripe) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://js.stripe.com/v3/";
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    // Cerrar modal de upgrade y abrir checkout
    document.getElementById("fmUpgradeModal")?.remove();

    const stripePublicKey = window.FM_STRIPE_PUBLIC_KEY || "pk_live_51TMAcSA7If2CqXs9NuKsM1cVT9n5agProkMR8HFiT6QTXzS0g9PtiokZ4cpT1Qo3rk9bbsrZHx9sOUbE9UEOjgGs00n1OM3Y9b";
    const stripe = window.Stripe(stripePublicKey);

    const checkoutContainer = document.createElement("div");
    checkoutContainer.id = "fmCheckoutModal";
    checkoutContainer.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; overflow-y: auto;
      font-family: 'Plus Jakarta Sans', sans-serif;
    `;
    checkoutContainer.innerHTML = `
      <div style="background:white;border-radius:16px;max-width:560px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.3);">
        <div style="padding:20px 24px;border-bottom:1px solid #F1F5F9;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;color:#3F4F2E;">CHECKOUT SEGURO</div>
            <div style="font-size:1.125rem;font-weight:700;color:#0F172A;">Plan ${plan.nombre}</div>
            <div style="font-size:0.8125rem;color:#64748B;margin-top:2px;">${window.fmFormatMXN(plan.precio)} · ${plan.duracion}</div>
          </div>
          <button onclick="window.fmCloseCheckout()" style="background:#F1F5F9;color:#475569;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">×</button>
        </div>
        <div id="fmCheckoutEmbed" style="padding:8px;"></div>
      </div>
    `;
    document.body.appendChild(checkoutContainer);

    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret: data.clientSecret
    });
    checkout.mount("#fmCheckoutEmbed");

    // Guardar instancia globalmente para poder destruirla después
    window._fmStripeCheckout = checkout;

    // Restaurar botón si lo había
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }

  } catch (err) {
    console.error("Error en checkout:", err);
    window.fmToast("Error al iniciar el pago: " + err.message, "danger");
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
    // Limpiar por si quedó algo a medias
    if (window._fmStripeCheckout) {
      try { window._fmStripeCheckout.destroy(); } catch(e) {}
      window._fmStripeCheckout = null;
    }
    document.getElementById("fmCheckoutModal")?.remove();
  }
};

// Helper para cerrar el checkout y limpiar la instancia
window.fmCloseCheckout = function() {
  if (window._fmStripeCheckout) {
    try { window._fmStripeCheckout.destroy(); } catch(e) {}
    window._fmStripeCheckout = null;
  }
  document.getElementById("fmCheckoutModal")?.remove();
};

// ============================================
// CANJE DE CÓDIGOS DE CORTESÍA
// ============================================
// Llama al backend POST /redeem-code con el ID token del usuario autenticado.
// Reusa el MISMO mecanismo de acceso (status:"active" + subscriptionEnd) — NO
// modifica fmComputeAccess. Devuelve siempre un objeto { ok, message, ... }.
window.fmRedeemCode = async function(code) {
  const user = window.fmAuth && window.fmAuth.currentUser;
  if (!user) {
    return { ok: false, message: "Inicia sesión primero" };
  }

  const normalized = (code || "").trim().toUpperCase();
  if (!normalized) {
    return { ok: false, message: "Ingresa un código" };
  }

  // Mapeo de errores del backend → mensajes claros en español
  const ERROR_MESSAGES = {
    CODIGO_INVALIDO: "Código no válido",
    CODIGO_INACTIVO: "Este código fue desactivado",
    CODIGO_EXPIRADO: "Este código ya venció",
    CODIGO_AGOTADO: "Este código ya alcanzó su límite de usos",
    YA_CANJEADO: "Ya canjeaste este código",
    NO_AUTENTICADO: "Inicia sesión primero"
  };

  try {
    // El usuario real de Firebase expone getIdToken(); en modo demo no existe.
    if (typeof user.getIdToken !== "function") {
      return { ok: false, message: "El canje no está disponible en modo demo" };
    }
    const token = await user.getIdToken();

    const FM_WEBHOOK_URL = window.FM_WEBHOOK_URL || "https://feedmix-webhook-production.up.railway.app";

    const response = await fetch(FM_WEBHOOK_URL + "/redeem-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ code: normalized })
    });

    // 429 = rate-limit (puede venir sin cuerpo JSON)
    if (response.status === 429) {
      return { ok: false, message: "Demasiados intentos, espera un minuto" };
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { ok: false, message: "Error de conexión, intenta de nuevo" };
    }

    if (data && data.ok) {
      return data; // { ok:true, accessUntil, message }
    }

    const friendly =
      (data && ERROR_MESSAGES[data.error]) ||
      (data && data.message) ||
      "No se pudo canjear el código";
    return { ok: false, error: data && data.error, message: friendly };

  } catch (err) {
    console.error("Error en fmRedeemCode:", err);
    return { ok: false, message: "Error de conexión, intenta de nuevo" };
  }
};

// Helper de UI reutilizable: conecta un input + botón + zona de mensaje a fmRedeemCode.
// Maneja estado "Canjeando…", anti doble-submit, mensajes inline y refresco de acceso.
// Tras un canje OK recarga la página para que fmAccess se recalcule y los candados
// premium desaparezcan solos (fallback explícito permitido y más fiable que mutar el DOM).
window.fmAttachRedeem = function(inputEl, btnEl, msgEl, onSuccess) {
  if (!inputEl || !btnEl) return;

  const showMsg = (text, type) => {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.style.display = "block";
    msgEl.style.color = type === "success" ? "#065F46" : "#B91C1C";
    msgEl.style.background = type === "success" ? "#ECFDF5" : "#FEF2F2";
    msgEl.style.border = "1px solid " + (type === "success" ? "#A7F3D0" : "#FECACA");
  };

  let busy = false;
  const handler = async () => {
    if (busy) return;
    const code = inputEl.value;
    if (!code || !code.trim()) { showMsg("Ingresa un código", "error"); return; }

    busy = true;
    const original = btnEl.textContent;
    btnEl.disabled = true;
    inputEl.disabled = true;
    btnEl.textContent = "Canjeando…";
    if (msgEl) msgEl.style.display = "none";

    const res = await window.fmRedeemCode(code);

    if (res && res.ok) {
      let fecha = "";
      try { if (res.accessUntil) fecha = window.fmDate(res.accessUntil); } catch (e) {}
      showMsg("¡Acceso activado" + (fecha ? " hasta " + fecha : "") + "! Actualizando…", "success");
      if (typeof onSuccess === "function") { try { onSuccess(res); } catch (e) {} }
      // Refrescar estado de acceso (recalcula fmAccess, quita candados)
      setTimeout(() => location.reload(), 1800);
    } else {
      showMsg((res && res.message) || "No se pudo canjear el código", "error");
      busy = false;
      btnEl.disabled = false;
      inputEl.disabled = false;
      btnEl.textContent = original;
    }
  };

  btnEl.addEventListener("click", handler);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); handler(); }
  });
};

// ============================================
// PREMIUM GUARD - SISTEMA "MODO EXPLORACIÓN"
// ============================================
// Bloquea acciones premium para usuarios sin acceso pagado.
// Uso simple:
//   if (window.fmCheckPremium('formulas')) { ... ejecutar acción ... }
//
// Si el usuario NO tiene acceso → muestra modal upgrade y devuelve false
// Si SÍ tiene acceso → devuelve true y deja pasar
// ============================================
window.fmCheckPremium = function(reason) {
  const acc = window.fmAccess;
  // Si no se ha cargado fmAccess todavía, permitir (auth guard ya redirigió si era necesario)
  if (!acc) return true;
  // Solo permitir si está PAGADO. Modo exploración = bloqueado.
  if (acc.isPaid) return true;
  // Cualquier otro caso → mostrar modal upgrade
  window.fmShowUpgradeModal({ reason: reason || "manual" });
  return false;
};

// Auto-marcar botones premium con candado visual y bloquearlos si no hay acceso
// Uso: agrega data-premium="reason" a cualquier botón premium
//   <button data-premium="formulas">Optimizar</button>
// El sistema automáticamente:
//   1. Agrega 🔒 al texto si no tiene acceso
//   2. Cambia el color a cobre (premium)
//   3. Intercepta el click y muestra modal upgrade
window.fmAutoGuardPremiumButtons = function() {
  const acc = window.fmAccess;
  if (!acc) return;
  const isBlocked = !acc.isPaid;

  document.querySelectorAll("[data-premium]").forEach(btn => {
    if (btn.dataset.fmGuarded === "1") return; // ya procesado
    const reason = btn.dataset.premium || "manual";

    if (isBlocked) {
      // Marcar visualmente
      btn.classList.add("fm-premium-locked");
      // Agregar candado si no lo tiene
      if (!btn.querySelector(".fm-lock-icon") && !btn.textContent.includes("🔒")) {
        const lock = document.createElement("span");
        lock.className = "fm-lock-icon";
        lock.textContent = "🔒 ";
        lock.style.marginRight = "4px";
        btn.insertBefore(lock, btn.firstChild);
      }
      // Interceptar TODOS los clicks
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.fmShowUpgradeModal({ reason });
      }, true); // capture phase para ganar a otros listeners
    }
    btn.dataset.fmGuarded = "1";
  });
};

// Estilos visuales para botones premium bloqueados
const premiumStyle = document.createElement("style");
premiumStyle.textContent = `
  .fm-premium-locked {
    background: linear-gradient(135deg, #B87333 0%, #D4925A 100%) !important;
    color: white !important;
    cursor: pointer !important;
    opacity: 1 !important;
    position: relative;
  }
  .fm-premium-locked:hover {
    background: linear-gradient(135deg, #A06028 0%, #B87333 100%) !important;
    box-shadow: 0 4px 12px rgba(184, 115, 51, 0.35);
  }
  /* EXCEPCIÓN: tabs del formulador NO cambian de color, solo agregan candado */
  .formulador-tab.fm-premium-locked {
    background: transparent !important;
    color: inherit !important;
    opacity: 0.6 !important;
  }
  .formulador-tab.fm-premium-locked:hover {
    background: rgba(184, 115, 51, 0.08) !important;
    box-shadow: none !important;
    opacity: 1 !important;
  }
  .fm-lock-icon {
    display: inline-block;
    margin-right: 4px;
  }
  /* Demo banner para secciones */
  .fm-demo-banner {
    background: linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%);
    border: 1px solid #FCD34D;
    color: #78350F;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .fm-demo-banner strong { font-weight: 700; }
  .fm-demo-banner button {
    margin-left: auto;
    background: #B87333;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.8125rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .fm-demo-banner button:hover { background: #A06028; }
`;
document.head.appendChild(premiumStyle);

// Helper para insertar banner "Estás en modo exploración" arriba de cualquier sección
window.fmShowExplorationBanner = function(targetSelector, message) {
  const acc = window.fmAccess;
  if (!acc) return;
  const isBlocked = !acc.isPaid;
  if (!isBlocked) return; // solo mostrar si no tiene acceso

  const target = document.querySelector(targetSelector);
  if (!target) return;
  if (target.querySelector(".fm-demo-banner")) return; // ya está

  const banner = document.createElement("div");
  banner.className = "fm-demo-banner";
  banner.innerHTML =
    '<span style="font-size:1.25rem;">🟡</span>' +
    '<div><strong>Modo exploración activo.</strong> ' + (message || 'Explora libremente. Activa tu plan para guardar y usar todas las funciones.') + '</div>' +
    '<button onclick="window.fmShowUpgradeModal()">Activar plan</button>';
  target.insertBefore(banner, target.firstChild);
};

// Auto-ejecutar el guard de botones cuando fmAccess esté listo
function autoPremiumGuard() {
  // Esperar a que fmAccess se calcule
  if (window.fmAccess) {
    window.fmAutoGuardPremiumButtons();
  } else {
    // Reintentar cada 200ms hasta 3 segundos
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (window.fmAccess || tries > 15) {
        clearInterval(interval);
        if (window.fmAccess) window.fmAutoGuardPremiumButtons();
      }
    }, 200);
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(autoPremiumGuard, 300));
} else {
  setTimeout(autoPremiumGuard, 300);
}


// Animación spinner
const spinnerStyle = document.createElement("style");
spinnerStyle.textContent = `@keyframes fmSpin { to { transform: rotate(360deg); } } @keyframes fmFadeIn { from { opacity: 0; } to { opacity: 1; } }`;
document.head.appendChild(spinnerStyle);

// Auto-insertar banner de paywall al cargar la app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(autoPaywallBanner, 100); // Pequeño delay para que fmAccess se calcule
  });
} else {
  setTimeout(autoPaywallBanner, 100);
}

// ============================================
// POPUP DE BIENVENIDA POST-PAGO + CONFETI 🎉
// ============================================
window.fmShowWelcomePopup = function(opts = {}) {
  if (document.getElementById("fmWelcomeModal")) return;

  const acc = window.fmAccess;
  const profile = window.fmProfile || {};
  const firstName = profile.firstName || opts.firstName || "Nutricionista";
  const planLabel = (acc && acc.planLabel) || opts.planLabel || "Plan activo";
  const plan = (acc && acc.plan) || opts.plan || "anual";

  const planEmoji = plan === "lifetime" ? "♾️" : plan === "anual" ? "📅" : "📦";
  const planVigencia = plan === "lifetime" ? "Acceso permanente — para siempre" :
                       plan === "anual" ? "12 meses de acceso completo" :
                       plan === "trimestral" ? "3 meses de acceso completo" :
                       "Acceso activo";

  const precios = { trimestral: 1399, anual: 2499, lifetime: 3499 };
  const monto = precios[plan] ? "$" + precios[plan].toLocaleString("es-MX") + " MXN" : "";

  const modal = document.createElement("div");
  modal.id = "fmWelcomeModal";
  modal.innerHTML = `
    <style>
      #fmWelcomeModal {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px; overflow-y: auto;
        font-family: 'Plus Jakarta Sans', sans-serif;
        animation: fmFadeIn 0.4s ease-out;
      }
      .fm-welcome-card {
        background: white;
        border-radius: 24px;
        max-width: 520px;
        width: 100%;
        max-height: 92vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 32px 96px rgba(0,0,0,.5);
        animation: fmPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      @keyframes fmPopIn {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .fm-welcome-header {
        background: linear-gradient(135deg, #3F4F2E 0%, #2A3520 100%);
        color: white;
        padding: 36px 28px 28px;
        border-radius: 24px 24px 0 0;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .fm-welcome-header::before {
        content: "";
        position: absolute;
        top: -50%; left: -50%; right: -50%; bottom: -50%;
        background: radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 60%);
        animation: fmGlow 3s ease-in-out infinite;
      }
      @keyframes fmGlow {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      .fm-welcome-emoji {
        font-size: 64px;
        line-height: 1;
        margin-bottom: 12px;
        animation: fmBounce 1s ease-in-out infinite;
        position: relative;
        z-index: 1;
      }
      @keyframes fmBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .fm-welcome-title {
        font-size: 1.875rem;
        font-weight: 800;
        margin: 0 0 8px 0;
        letter-spacing: -0.02em;
        position: relative;
        z-index: 1;
        line-height: 1.15;
      }
      .fm-welcome-subtitle {
        opacity: 0.9;
        font-size: 1.0625rem;
        margin: 0;
        position: relative;
        z-index: 1;
      }
      .fm-welcome-body { padding: 24px 28px 12px; }
      .fm-welcome-plan-card {
        background: linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%);
        border: 2px solid #B87333;
        border-radius: 16px;
        padding: 18px 20px;
        margin-bottom: 20px;
        text-align: center;
      }
      .fm-welcome-plan-emoji {
        font-size: 28px;
        margin-bottom: 4px;
      }
      .fm-welcome-plan-name {
        font-size: 1.125rem;
        font-weight: 800;
        color: #78350F;
        margin: 0 0 4px 0;
      }
      .fm-welcome-plan-detail {
        font-size: 0.875rem;
        color: #92400E;
        margin: 0;
      }
      .fm-welcome-plan-monto {
        font-size: 0.75rem;
        color: #92400E;
        opacity: 0.7;
        margin-top: 6px;
        font-weight: 600;
      }
      .fm-welcome-list-title {
        font-size: 0.6875rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #3F4F2E;
        text-transform: uppercase;
        margin-bottom: 12px;
        text-align: center;
      }
      .fm-welcome-list {
        list-style: none;
        padding: 0;
        margin: 0 0 24px 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .fm-welcome-list li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 0.9375rem;
        color: #334155;
        line-height: 1.5;
      }
      .fm-welcome-list li::before {
        content: "✓";
        background: #10B981;
        color: white;
        width: 22px; height: 22px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-weight: 800;
        font-size: 0.75rem;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .fm-welcome-cta {
        display: block;
        width: 100%;
        background: linear-gradient(135deg, #3F4F2E 0%, #5A6E45 100%);
        color: white;
        border: none;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 800;
        cursor: pointer;
        font-family: inherit;
        letter-spacing: 0.02em;
        transition: all 0.2s;
        box-shadow: 0 4px 16px rgba(63, 79, 46, 0.3);
      }
      .fm-welcome-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(63, 79, 46, 0.45);
      }
      .fm-welcome-footer {
        padding: 16px 28px 28px;
        text-align: center;
        font-size: 0.75rem;
        color: #94A3B8;
      }
      .fm-confetti-container {
        position: fixed; inset: 0; pointer-events: none; z-index: 10001;
        overflow: hidden;
      }
      .fm-confetti {
        position: absolute;
        width: 10px; height: 10px;
        top: -20px;
        animation: fmFall linear forwards;
      }
      @keyframes fmFall {
        to { transform: translateY(105vh) rotate(720deg); }
      }
    </style>

    <div class="fm-welcome-card">
      <div class="fm-welcome-header">
        <div class="fm-welcome-emoji">🎉</div>
        <h2 class="fm-welcome-title">¡Felicidades, ${firstName}!</h2>
        <p class="fm-welcome-subtitle">Ya eres miembro VIP de FeedMix MX</p>
      </div>

      <div class="fm-welcome-body">
        <div class="fm-welcome-plan-card">
          <div class="fm-welcome-plan-emoji">${planEmoji}</div>
          <div class="fm-welcome-plan-name">${planLabel}</div>
          <p class="fm-welcome-plan-detail">${planVigencia}</p>
          ${monto ? `<div class="fm-welcome-plan-monto">Inversión: ${monto}</div>` : ""}
        </div>

        <div class="fm-welcome-list-title">✨ Acabas de desbloquear</div>
        <ul class="fm-welcome-list">
          <li>Fórmulas ilimitadas con optimización de mínimo costo</li>
          <li>PDFs profesionales sin marca de agua</li>
          <li>Aminograma completo de 8 AA esenciales</li>
          <li>Alertas inteligentes (Met limitante, Ca, EM/PC)</li>
          <li>Soporte prioritario por WhatsApp</li>
        </ul>

        <button class="fm-welcome-cta" id="fmWelcomeCta">🚀 Empezar a formular</button>
      </div>

      <div class="fm-welcome-footer">
        Cualquier duda escríbenos al WhatsApp: +52 1 238 251 4313
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Confeti animado
  const confetti = document.createElement("div");
  confetti.className = "fm-confetti-container";
  const colors = ["#B87333", "#3F4F2E", "#FCD34D", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.className = "fm-confetti";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2.5) + "s";
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    if (Math.random() > 0.5) piece.style.borderRadius = "50%";
    confetti.appendChild(piece);
  }
  document.body.appendChild(confetti);
  // Quitar confeti después de 6 segundos
  setTimeout(() => confetti.remove(), 6000);

  // CTA
  document.getElementById("fmWelcomeCta").addEventListener("click", () => {
    modal.remove();
    if (location.pathname.endsWith("panel.html") || location.pathname === "/") {
      location.href = "formulador.html";
    } else {
      // Ya está en otra página, solo cerrar el modal
    }
  });

  // Click fuera del card cierra
  modal.addEventListener("click", function(e) {
    if (e.target === modal) modal.remove();
  });
};

// Auto-detectar redirect de Stripe Checkout exitoso
// Si la URL trae ?stripe_session=cs_xxx, mostrar popup celebratorio
if (typeof window !== "undefined" && window.location.search.includes("stripe_session=")) {
  const showWelcome = () => {
    // Esperar a que fmAccess esté listo (perfil cargado de Firestore)
    let tries = 0;
    const checkAndShow = setInterval(() => {
      tries++;
      if (window.fmAccess && window.fmAccess.isPaid) {
        clearInterval(checkAndShow);
        window.fmShowWelcomePopup();
        // Limpiar URL sin recargar
        const url = new URL(window.location.href);
        url.searchParams.delete("stripe_session");
        history.replaceState({}, "", url.toString());
      } else if (tries > 25) {
        // 5 segundos sin perfil pagado — el webhook puede tardar
        clearInterval(checkAndShow);
        // Mostrar popup genérico de todas formas
        window.fmShowWelcomePopup({
          firstName: window.fmProfile?.firstName,
          planLabel: "Plan activado",
          plan: "anual"
        });
        const url = new URL(window.location.href);
        url.searchParams.delete("stripe_session");
        history.replaceState({}, "", url.toString());
      }
    }, 200);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(showWelcome, 500));
  } else {
    setTimeout(showWelcome, 500);
  }
}

// ============================================
// NAV MÓVIL (hamburguesa) — páginas "app" (.app-shell + .app-sidebar)
// ============================================
// Inyecta un botón ☰ al inicio de .app-topbar y un backdrop en el body. El sidebar
// se vuelve un panel off-canvas vía CSS (@media ≤900px); en desktop la ☰ está oculta
// por CSS, así que NADA cambia en pantallas grandes. Centralizado: aplica a toda
// página que cargue shared.js y tenga ese layout (panel, perfil, formulador,
// ingredientes, nucleos, recomendaciones, historial, suscripcion).
function fmInitAppMobileNav() {
  const topbar = document.querySelector(".app-topbar");
  const sidebar = document.querySelector(".app-sidebar");
  if (!topbar || !sidebar) return;                     // no es página "app": no hacer nada
  if (topbar.querySelector(".app-hamburger")) return;  // evitar doble inicialización

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "app-hamburger";
  btn.setAttribute("aria-label", "Abrir menú de navegación");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  topbar.insertBefore(btn, topbar.firstChild);

  const backdrop = document.createElement("div");
  backdrop.className = "app-sidebar-backdrop";
  document.body.appendChild(backdrop);

  function openNav() {
    sidebar.classList.add("open");
    backdrop.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains("open")) closeNav();
    else openNav();
  });
  backdrop.addEventListener("click", closeNav);
  // Cerrar al elegir un enlace del menú (navegación)
  sidebar.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) closeNav();
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fmInitAppMobileNav);
} else {
  fmInitAppMobileNav();
}
