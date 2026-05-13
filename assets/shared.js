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
      if (redirectIfAuth && user) {
        window.location.href = redirectIfAuth;
        return;
      }
      if (user) {
        try {
          const ref = window.fmFirebase.doc(window.fmDb, "nutricionistas", user.uid);
          const snap = await window.fmFirebase.getDoc(ref);
          window.fmProfile = snap.exists() ? snap.data() : null;
        } catch (e) {
          console.warn("No se pudo cargar perfil:", e);
          window.fmProfile = null;
        }
        // Calcular acceso centralizado
        window.fmAccess = window.fmComputeAccess(window.fmProfile);
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

  const trialEnd = toDate(profile.trialEnd);
  const subscriptionEnd = toDate(profile.subscriptionEnd);

  // ¿Está en trial activo?
  const isTrialActive = status === "trial" && trialEnd && trialEnd > now;
  // ¿Tiene suscripción activa pagada?
  const isPaidActive = status === "active" && (!subscriptionEnd || subscriptionEnd > now);
  // ¿Ya expiró?
  const isExpired = !isTrialActive && !isPaidActive;

  // Días restantes
  let daysLeft = 0;
  let endDate = null;
  if (isTrialActive) {
    daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
    endDate = trialEnd;
  } else if (isPaidActive && subscriptionEnd) {
    daysLeft = Math.ceil((subscriptionEnd - now) / (1000 * 60 * 60 * 24));
    endDate = subscriptionEnd;
  }

  // Acceso
  const hasAccess = isTrialActive || isPaidActive;

  // Límite de fórmulas (trial limita a 3, pagado ilimitado)
  const formulasLimit = isPaidActive ? Infinity : (isTrialActive ? 10 : 0);

  // Labels para UI
  const planLabel = plan === "despacho" ? "Plan Despacho" : "Plan Profesional";
  let statusLabel;
  if (isPaidActive) statusLabel = "Activa";
  else if (isTrialActive) statusLabel = "Prueba gratis (" + daysLeft + " días)";
  else if (status === "cancelled") statusLabel = "Cancelada";
  else statusLabel = "Prueba expirada";

  return {
    status: status,
    plan: plan,
    hasAccess: hasAccess,
    isTrial: isTrialActive,
    isPaid: isPaidActive,
    isExpired: isExpired,
    daysLeft: daysLeft,
    endDate: endDate,
    canCreateFormula: hasAccess && (formulasCount < formulasLimit),
    canSavePDF: hasAccess,
    canRemoveWatermark: isPaidActive, // Trial siempre con marca de agua
    canHaveMultipleUsers: isPaidActive && plan === "despacho",
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
      (acc.daysLeft > 0 ? ' · Renueva en ' + acc.daysLeft + ' días' : '') +
      '</span>';
  } else if (acc.isTrial) {
    // Trial activo - banner ámbar con CTA
    const urgencia = acc.daysLeft <= 3 ? '🔥 ' : '🟡 ';
    bgGrad = acc.daysLeft <= 3
      ? "linear-gradient(90deg, #FEF3C7 0%, #FBBF24 100%)"
      : "linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%)";
    color = "#78350F";
    borderBottom = "#FCD34D";
    content =
      '<span>' + urgencia + '<strong>Te quedan ' + acc.daysLeft + ' días de prueba</strong>' +
      (acc.formulasLimit !== Infinity ? ' · ' + acc.formulasCount + '/' + acc.formulasLimit + ' fórmulas usadas' : '') +
      '</span>' +
      '<button onclick="window.fmShowUpgradeModal()" style="background:#B87333;color:white;border:none;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;">Activar plan</button>';
  } else {
    // Expirado - banner rojo
    bgGrad = "linear-gradient(90deg, #FEE2E2 0%, #FECACA 100%)";
    color = "#7F1D1D";
    borderBottom = "#FCA5A5";
    content =
      '<span>🔴 <strong>Tu prueba terminó</strong> · Activa tu plan para seguir usando FeedMix</span>' +
      '<button onclick="window.fmShowUpgradeModal()" style="background:#DC2626;color:white;border:none;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;">Activar ahora</button>';
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
      throw new Error("Error " + response.status + " al crear sesión de pago");
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
          <button onclick="document.getElementById('fmCheckoutModal').remove()" style="background:#F1F5F9;color:#475569;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">×</button>
        </div>
        <div id="fmCheckoutEmbed" style="padding:8px;"></div>
      </div>
    `;
    document.body.appendChild(checkoutContainer);

    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret: data.clientSecret
    });
    checkout.mount("#fmCheckoutEmbed");

  } catch (err) {
    console.error("Error en checkout:", err);
    window.fmToast("Error al iniciar el pago: " + err.message, "danger");
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
};

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
