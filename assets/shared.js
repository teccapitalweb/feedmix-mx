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
window.FM_PRICING = {
  pro: {
    nombre: "Profesional",
    descripcion: "Para nutricionistas y granjeros independientes",
    mensual: 1499,
    anual: 14990,
    ahorroAnual: "2 meses gratis",
    // Stripe Price IDs — REEMPLAZAR con los reales tras crear productos en Stripe
    stripePriceMensual: "price_FEEDMIX_PRO_MENSUAL_PLACEHOLDER",
    stripePriceAnual: "price_FEEDMIX_PRO_ANUAL_PLACEHOLDER",
    features: [
      "1 usuario nutricionista o granjero",
      "Fórmulas ilimitadas",
      "179 etapas técnicas · 30 razas",
      "Aminograma completo (8 AA)",
      "Alertas inteligentes",
      "PDF profesional FeedMix",
      "Plan de parvada oficial",
      "Soporte por email + WhatsApp"
    ]
  },
  despacho: {
    nombre: "Despacho",
    descripcion: "Para consultorías y empresas",
    mensual: 3499,
    anual: 34990,
    ahorroAnual: "2 meses gratis",
    stripePriceMensual: "price_FEEDMIX_DESPACHO_MENSUAL_PLACEHOLDER",
    stripePriceAnual: "price_FEEDMIX_DESPACHO_ANUAL_PLACEHOLDER",
    features: [
      "Hasta 5 usuarios",
      "Todo lo del plan Profesional",
      "PDF con marca blanca (logo + datos del despacho)",
      "Cartera de clientes compartida",
      "Soporte prioritario WhatsApp",
      "Capacitación inicial 1:1",
      "Onboarding personalizado"
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
// MODAL DE UPGRADE (paywall completo)
// ============================================
window.fmShowUpgradeModal = function(opts = {}) {
  // opts.reason puede ser: "expired" | "formulas" | "watermark" | "save" | "manual"
  const reason = opts.reason || "manual";
  if (document.getElementById("fmUpgradeModal")) return;

  const reasonMsg = {
    expired: "Tu prueba gratuita terminó. Activa tu plan para seguir formulando.",
    formulas: "Has alcanzado el límite de fórmulas de la prueba. Activa Profesional para fórmulas ilimitadas.",
    watermark: "Quita la marca de agua activando el plan Profesional o Despacho.",
    save: "Guarda fórmulas en la nube activando el plan Profesional o Despacho.",
    multipleUsers: "El plan Despacho permite hasta 5 usuarios trabajando en paralelo.",
    manual: "Activa todo el poder de FeedMix MX."
  }[reason];

  const pricing = window.FM_PRICING;
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

  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:920px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.3);">
      <div style="background:linear-gradient(135deg,#3F4F2E 0%,#2A3520 100%);color:white;padding:28px 32px;border-radius:16px 16px 0 0;position:relative;">
        <button onclick="document.getElementById('fmUpgradeModal').remove()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,.15);color:white;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">×</button>
        <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;color:#D4925A;margin-bottom:6px;">ACTIVA FEEDMIX MX</div>
        <h2 style="font-size:1.75rem;font-weight:800;margin:0 0 8px 0;line-height:1.2;">Sigue formulando sin límites</h2>
        <p style="opacity:0.85;margin:0;font-size:0.9375rem;line-height:1.5;">${reasonMsg}</p>
      </div>

      <div style="padding:20px 32px;display:flex;justify-content:center;gap:8px;align-items:center;border-bottom:1px solid #F1F5F9;">
        <span style="font-size:0.8125rem;font-weight:600;color:#64748B;">Facturación:</span>
        <div style="background:#F1F5F9;padding:3px;border-radius:999px;display:flex;gap:3px;">
          <button id="billCycleMensual" onclick="window.fmToggleBilling('mensual')" style="border:none;padding:6px 14px;border-radius:999px;font-weight:700;font-size:0.8125rem;cursor:pointer;background:transparent;color:#475569;">Mensual</button>
          <button id="billCycleAnual" onclick="window.fmToggleBilling('anual')" style="border:none;padding:6px 14px;border-radius:999px;font-weight:700;font-size:0.8125rem;cursor:pointer;background:#3F4F2E;color:white;">Anual <span style="background:#B87333;color:white;font-size:0.625rem;padding:2px 6px;border-radius:999px;margin-left:4px;">-17%</span></button>
        </div>
      </div>

      <div style="padding:24px 32px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">

        <div style="border:2px solid #E2E8F0;border-radius:12px;padding:24px;display:flex;flex-direction:column;">
          <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;color:#B87333;margin-bottom:4px;">PROFESIONAL</div>
          <div style="color:#64748B;font-size:0.8125rem;margin-bottom:16px;">${pricing.pro.descripcion}</div>
          <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px;">
            <span style="font-size:0.875rem;color:#94A3B8;font-weight:600;">$</span>
            <span id="proPriceAmount" style="font-size:2.5rem;font-weight:800;color:#0F172A;line-height:1;">${pricing.pro.anual.toLocaleString("es-MX")}</span>
            <span id="proPricePeriod" style="font-size:0.875rem;color:#64748B;">MXN / año</span>
          </div>
          <div id="proPriceHint" style="font-size:0.75rem;color:#94A3B8;margin-bottom:16px;">Equivale a $1,249/mes · ${pricing.pro.ahorroAnual}</div>
          <button id="btnUpgradePro" onclick="window.fmStartCheckout('pro')" style="background:#3F4F2E;color:white;border:none;padding:12px 16px;border-radius:8px;font-weight:700;font-size:0.9375rem;cursor:pointer;margin-bottom:16px;">Activar Profesional</button>
          <ul style="list-style:none;padding:0;margin:0;font-size:0.8125rem;color:#475569;display:flex;flex-direction:column;gap:8px;">
            ${pricing.pro.features.map(f => '<li style="display:flex;gap:8px;"><span style="color:#10B981;font-weight:700;flex-shrink:0;">✓</span><span>' + f + '</span></li>').join('')}
          </ul>
        </div>

        <div style="border:2px solid #B87333;border-radius:12px;padding:24px;display:flex;flex-direction:column;background:linear-gradient(180deg,#FFFFFF 0%,#FFF7ED 100%);position:relative;">
          <div style="position:absolute;top:-10px;right:16px;background:#B87333;color:white;font-size:0.625rem;font-weight:800;letter-spacing:0.08em;padding:4px 10px;border-radius:999px;">RECOMENDADO</div>
          <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;color:#B87333;margin-bottom:4px;">DESPACHO</div>
          <div style="color:#64748B;font-size:0.8125rem;margin-bottom:16px;">${pricing.despacho.descripcion}</div>
          <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px;">
            <span style="font-size:0.875rem;color:#94A3B8;font-weight:600;">$</span>
            <span id="despachoPriceAmount" style="font-size:2.5rem;font-weight:800;color:#0F172A;line-height:1;">${pricing.despacho.anual.toLocaleString("es-MX")}</span>
            <span id="despachoPricePeriod" style="font-size:0.875rem;color:#64748B;">MXN / año</span>
          </div>
          <div id="despachoPriceHint" style="font-size:0.75rem;color:#94A3B8;margin-bottom:16px;">Equivale a $2,916/mes · ${pricing.despacho.ahorroAnual}</div>
          <button id="btnUpgradeDespacho" onclick="window.fmStartCheckout('despacho')" style="background:#B87333;color:white;border:none;padding:12px 16px;border-radius:8px;font-weight:700;font-size:0.9375rem;cursor:pointer;margin-bottom:16px;">Activar Despacho</button>
          <ul style="list-style:none;padding:0;margin:0;font-size:0.8125rem;color:#475569;display:flex;flex-direction:column;gap:8px;">
            ${pricing.despacho.features.map(f => '<li style="display:flex;gap:8px;"><span style="color:#10B981;font-weight:700;flex-shrink:0;">✓</span><span>' + f + '</span></li>').join('')}
          </ul>
        </div>

      </div>

      <div style="padding:16px 32px;border-top:1px solid #F1F5F9;background:#F8FAFC;border-radius:0 0 16px 16px;text-align:center;font-size:0.75rem;color:#64748B;">
        🔒 Pago seguro con Stripe · 💸 Garantía 30 días devolución · 🇲🇽 Precios en pesos mexicanos
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Click fuera del card para cerrar
  modal.addEventListener("click", function(e) {
    if (e.target === modal) modal.remove();
  });
};

// Estado global del modal: ciclo de facturación seleccionado
window._fmBillingCycle = "anual";

window.fmToggleBilling = function(cycle) {
  window._fmBillingCycle = cycle;
  const pricing = window.FM_PRICING;

  const btnMensual = document.getElementById("billCycleMensual");
  const btnAnual = document.getElementById("billCycleAnual");
  if (btnMensual && btnAnual) {
    btnMensual.style.background = cycle === "mensual" ? "#3F4F2E" : "transparent";
    btnMensual.style.color = cycle === "mensual" ? "white" : "#475569";
    btnAnual.style.background = cycle === "anual" ? "#3F4F2E" : "transparent";
    btnAnual.style.color = cycle === "anual" ? "white" : "#475569";
  }

  // Actualizar precios
  if (cycle === "mensual") {
    document.getElementById("proPriceAmount").textContent = pricing.pro.mensual.toLocaleString("es-MX");
    document.getElementById("proPricePeriod").textContent = "MXN / mes";
    document.getElementById("proPriceHint").textContent = "Cancela cuando quieras";
    document.getElementById("despachoPriceAmount").textContent = pricing.despacho.mensual.toLocaleString("es-MX");
    document.getElementById("despachoPricePeriod").textContent = "MXN / mes";
    document.getElementById("despachoPriceHint").textContent = "Cancela cuando quieras";
  } else {
    document.getElementById("proPriceAmount").textContent = pricing.pro.anual.toLocaleString("es-MX");
    document.getElementById("proPricePeriod").textContent = "MXN / año";
    document.getElementById("proPriceHint").textContent = "Equivale a $" + Math.round(pricing.pro.anual / 12).toLocaleString("es-MX") + "/mes · " + pricing.pro.ahorroAnual;
    document.getElementById("despachoPriceAmount").textContent = pricing.despacho.anual.toLocaleString("es-MX");
    document.getElementById("despachoPricePeriod").textContent = "MXN / año";
    document.getElementById("despachoPriceHint").textContent = "Equivale a $" + Math.round(pricing.despacho.anual / 12).toLocaleString("es-MX") + "/mes · " + pricing.despacho.ahorroAnual;
  }
};

// ============================================
// CHECKOUT CON STRIPE
// ============================================
window.fmStartCheckout = async function(planKey) {
  const user = window.fmAuth?.currentUser;
  if (!user) {
    window.fmToast("Inicia sesión primero", "warning");
    return;
  }

  const cycle = window._fmBillingCycle || "anual";
  const plan = window.FM_PRICING[planKey];
  if (!plan) {
    window.fmToast("Plan no válido", "danger");
    return;
  }

  const priceId = cycle === "mensual" ? plan.stripePriceMensual : plan.stripePriceAnual;

  // Mostrar loading
  const btn = document.getElementById("btnUpgrade" + planKey.charAt(0).toUpperCase() + planKey.slice(1));
  const originalText = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:fmSpin 0.8s linear infinite;"></span> Cargando...';
  }

  try {
    // El webhook server (Railway) crea la sesión de Stripe Embedded Checkout
    const FM_WEBHOOK_URL = window.FM_WEBHOOK_URL || "https://feedmix-webhook-production.up.railway.app";

    const response = await fetch(FM_WEBHOOK_URL + "/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: priceId,
        plan: planKey,
        cycle: cycle,
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

    // Cargar Stripe.js y montar Embedded Checkout
    if (!window.Stripe) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://js.stripe.com/v3/";
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    // Cerrar modal de upgrade y abrir embedded checkout
    document.getElementById("fmUpgradeModal")?.remove();

    const stripePublicKey = window.FM_STRIPE_PUBLIC_KEY || "pk_live_PLACEHOLDER_REEMPLAZAR";
    const stripe = window.Stripe(stripePublicKey);

    // Container del embedded checkout
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
            <div style="font-size:1.125rem;font-weight:700;color:#0F172A;">${plan.nombre} - ${cycle === "mensual" ? "Mensual" : "Anual"}</div>
            <div style="font-size:0.8125rem;color:#64748B;margin-top:2px;">${window.fmFormatMXN(cycle === "mensual" ? plan.mensual : plan.anual)}${cycle === "mensual" ? "/mes" : "/año"}</div>
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
