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

}

// ============================================
// API PÚBLICA COMÚN (igual en demo y producción)
// ============================================

window.fmAuthGuard = function(opts = {}) {
  const { requireAuth = true, redirectIfAuth = null } = opts;
  return new Promise((resolve) => {
    window.fmFirebase.onAuthStateChanged(window.fmAuth, async (user) => {
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
      }
      resolve(user);
    });
  });
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
    background: #FEF3C7; color: #92400E;
    padding: 10px 16px; text-align: center;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
    border-bottom: 1px solid #FCD34D;
    position: sticky; top: 0; z-index: 200;
  `;
  b.innerHTML = `🟡 <strong>Modo demo activo</strong> · Datos guardados localmente · Cuenta demo: <code style="background:rgba(0,0,0,.06);padding:2px 6px;border-radius:4px;">demo@feedmix.mx</code> / <code style="background:rgba(0,0,0,.06);padding:2px 6px;border-radius:4px;">demo123</code>`;
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
