// ============================================
// FeedMix MX — Shared JS
// Firebase init + helpers globales
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ============================================
// INIT
// ============================================

const app = initializeApp(window.FEEDMIX_FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

// Exponer globalmente para que cada página pueda usar
window.fmAuth = auth;
window.fmDb = db;
window.fmFirebase = {
  doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs,
  query, where, orderBy, serverTimestamp, deleteDoc,
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut, updateProfile
};

// ============================================
// AUTH GUARD — protege páginas autenticadas
// ============================================

window.fmAuthGuard = function(opts = {}) {
  const { requireAuth = true, redirectIfAuth = null } = opts;
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (requireAuth && !user) {
        window.location.href = "login.html";
        return;
      }
      if (redirectIfAuth && user) {
        window.location.href = redirectIfAuth;
        return;
      }
      if (user) {
        // Cargar perfil del nutricionista
        try {
          const profileSnap = await getDoc(doc(db, "nutricionistas", user.uid));
          window.fmProfile = profileSnap.exists() ? profileSnap.data() : null;
        } catch (e) { console.warn("No se pudo cargar perfil:", e); }
      }
      resolve(user);
    });
  });
};

// ============================================
// LOGOUT
// ============================================

window.fmLogout = async function() {
  await signOut(auth);
  window.location.href = "index.html";
};

// ============================================
// HELPERS UI
// ============================================

window.fmToast = function(message, type = "info") {
  const colors = {
    info: "#0EA5E9",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B"
  };
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
styleEl.textContent = `
  @keyframes fmSlideIn {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(styleEl);

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
