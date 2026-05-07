// ============================================
// FeedMix MX — Sistema de Especies
// Onboarding por especie + filtrado contextual
// ============================================

window.FM_SPECIES = {

  // ============================================
  // CATÁLOGO DE ESPECIES
  // ============================================
  CATALOGO: [
    {
      id: "engorda",
      nombre: "Pollo de engorda",
      descripcion: "Cobb, Ross, Hubbard — 35-49 días",
      tagline: "Producción de carne avícola",
      svg: "assets/species/engorda.svg",
      color: "#F59E0B",
      colorBg: "#FFFBEB",
      icon: "🐔",
      tipoFormulador: "engorda",
      razasPreferidas: ["cobb500", "cobb700", "ross308", "ross708", "hubbard"],
      etapasTipicas: ["preiniciador", "iniciador", "crecimiento", "finalizador", "retiro"],
      tipsClave: [
        "Mantén EM mínimo 3,000 kcal/kg para lograr conversión <1.7",
        "Coccidiostato obligatorio hasta retiro (5 días antes de sacrificio)",
        "Aminoácidos digestibles, no totales — usa NRC actualizado"
      ]
    },
    {
      id: "ponedora",
      nombre: "Gallina ponedora",
      descripcion: "Hy-Line, Lohmann, Bovans — postura comercial",
      tagline: "Producción de huevo de mesa",
      svg: "assets/species/ponedora.svg",
      color: "#EA580C",
      colorBg: "#FFF7ED",
      icon: "🥚",
      tipoFormulador: "ponedora",
      razasPreferidas: ["hyline-w36", "hyline-w80", "hyline-brown", "lohmann-lsl", "lohmann-brown", "bovans"],
      etapasTipicas: ["pollita-ini", "pollita-crec", "pollona-des", "prepostura", "fase1", "fase2", "fase3"],
      tipsClave: [
        "Calcio 4.0% mínimo en pico de postura",
        "Carbonato grueso 60-70% del Ca total para integridad de cáscara",
        "Pigmento marigold si el mercado regional valora yema amarilla"
      ]
    },
    {
      id: "reproductora",
      nombre: "Reproductora pesada",
      descripcion: "Cobb breeders, Ross breeders — huevo fértil",
      tagline: "Producción de pollito de un día",
      svg: "assets/species/reproductora.svg",
      color: "#991B1B",
      colorBg: "#FEF2F2",
      icon: "🐓",
      tipoFormulador: "reproductora",
      razasPreferidas: ["cobb-breeder", "ross-breeder", "hubbard-breeder"],
      etapasTipicas: ["rep-ini", "rep-crec", "rep-des", "rep-prepost", "rep-pico", "rep-media", "rep-final"],
      tipsClave: [
        "Vitamina E mínimo 50 UI/kg para fertilidad",
        "Selenio orgánico para calidad de cascarón y embrionaria",
        "Control estricto de peso corporal vs guía genética"
      ]
    },
    {
      id: "pavo",
      nombre: "Pavo",
      descripcion: "Nicholas, B.U.T., Hybrid — 84-126 días",
      tagline: "Producción de carne de pavo",
      svg: "assets/species/pavo.svg",
      color: "#7C2D12",
      colorBg: "#FEF3C7",
      icon: "🦃",
      tipoFormulador: "pavo",
      razasPreferidas: ["nicholas-select", "but-6", "hybrid-converter"],
      etapasTipicas: ["pavo-preini", "pavo-ini", "pavo-crec", "pavo-des", "pavo-fin", "pavo-acab"],
      tipsClave: [
        "Lisina 1.6%+ en preiniciador, baja gradualmente",
        "Mn elevado (110+ ppm) para esqueleto correcto",
        "Cuidado con problemas de patas — calcio:fósforo 2:1"
      ]
    },
    {
      id: "doble_proposito",
      nombre: "Doble propósito / Criolla",
      descripcion: "Plymouth Rock, Rhode Island Red, criollas",
      tagline: "Carne y huevo en sistema rústico",
      svg: "assets/species/doble_proposito.svg",
      color: "#A16207",
      colorBg: "#FEFCE8",
      icon: "🐤",
      tipoFormulador: "doble_proposito",
      razasPreferidas: ["plymouth-rock", "rhode-island", "sussex", "criollo-mexicano"],
      etapasTipicas: ["dp-ini", "dp-crec", "dp-post", "dp-mant"],
      tipsClave: [
        "Núcleos económicos al 5% funcionan mejor — no exigen densidad alta",
        "Maíz blanco regional + soya pasta como base",
        "Sistema de pastoreo reduce 20-30% costo de alimento"
      ]
    },
    {
      id: "varias",
      nombre: "Multi-especie",
      descripcion: "Manejo todas las anteriores",
      tagline: "Sin filtro — acceso completo",
      svg: "assets/species/varias.svg",
      color: "#1E40AF",
      colorBg: "#EFF6FF",
      icon: "🌐",
      tipoFormulador: null, // sin filtro
      razasPreferidas: [],
      etapasTipicas: [],
      tipsClave: [
        "Acceso a las 31 razas avícolas del catálogo",
        "Cambia entre especies usando el selector del sidebar",
        "Útil para consultoras que atienden múltiples granjeros"
      ]
    }
  ],

  // ============================================
  // PERSISTENCIA
  // ============================================

  // Obtiene la especie activa actual
  getActiva() {
    const id = localStorage.getItem("fm_especie_activa");
    if (!id) return null;
    return this.CATALOGO.find(s => s.id === id) || null;
  },

  // Establece especie activa
  setActiva(especieId) {
    const especie = this.CATALOGO.find(s => s.id === especieId);
    if (!especie) return false;
    localStorage.setItem("fm_especie_activa", especieId);
    localStorage.setItem("fm_especie_seleccionada", "1");
    // Sincronizar con Firestore en background si hay sesión
    this._syncFirestore(especieId);
    return especie;
  },

  // Verifica si el usuario ya eligió alguna vez
  yaEligio() {
    return localStorage.getItem("fm_especie_seleccionada") === "1";
  },

  // Reset (para testing)
  reset() {
    localStorage.removeItem("fm_especie_activa");
    localStorage.removeItem("fm_especie_seleccionada");
  },

  // Sincronización Firestore (silenciosa)
  async _syncFirestore(especieId) {
    try {
      if (!window.fmAuth || !window.fmAuth.currentUser) return;
      if (!window.fmDb) return;
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
      const ref = doc(window.fmDb, "usuarios", window.fmAuth.currentUser.uid);
      await setDoc(ref, { especiePrincipal: especieId, especieActualizadaEn: new Date().toISOString() }, { merge: true });
    } catch (e) {
      // Silencioso, no debe romper UX
      console.log("Sync FS especie:", e.message);
    }
  },

  // ============================================
  // FILTRADO CONTEXTUAL
  // ============================================

  // Filtra una lista de razas por especie activa
  filtrarRazas(razasArray) {
    const activa = this.getActiva();
    if (!activa || activa.id === "varias") return razasArray;
    return razasArray.filter(r => activa.razasPreferidas.includes(r.id));
  },

  // Filtra etapas
  filtrarEtapas(etapasArray) {
    const activa = this.getActiva();
    if (!activa || activa.id === "varias") return etapasArray;
    return etapasArray.filter(e => activa.etapasTipicas.includes(e.id));
  },

  // Devuelve el tipo de formulador a pre-seleccionar
  getTipoFormulador() {
    const activa = this.getActiva();
    if (!activa || !activa.tipoFormulador) return "engorda"; // default
    return activa.tipoFormulador;
  },

  // ============================================
  // RENDER COMPONENTES
  // ============================================

  // Crea card grande para selector
  renderCard(especie) {
    return `
      <button type="button" class="species-card" data-especie="${especie.id}" style="--species-color:${especie.color};--species-bg:${especie.colorBg};">
        <div class="species-card-image">
          <img src="${especie.svg}" alt="${especie.nombre}" loading="lazy">
        </div>
        <div class="species-card-content">
          <div class="species-card-name">${especie.nombre}</div>
          <div class="species-card-desc">${especie.descripcion}</div>
          <div class="species-card-tagline">${especie.tagline}</div>
        </div>
        <div class="species-card-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>
    `;
  },

  // ============================================
  // MODAL DE ONBOARDING (estilo Linear)
  // ============================================
  mostrarOnboarding(force = false) {
    if (!force && this.yaEligio()) return;

    // Inyectar estilos si no existen
    if (!document.getElementById("fm-species-styles")) {
      const style = document.createElement("style");
      style.id = "fm-species-styles";
      style.textContent = this._getStyles();
      document.head.appendChild(style);
    }

    // Crear modal
    const modal = document.createElement("div");
    modal.id = "fmSpeciesModal";
    modal.className = "fm-species-modal-backdrop";
    modal.innerHTML = `
      <div class="fm-species-modal">
        <div class="fm-species-modal-header">
          <div class="fm-species-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2z"/></svg>
            Configuración inicial
          </div>
          <h2>¿Para qué especie vas a formular?</h2>
          <p>Esto personaliza toda tu experiencia: razas filtradas, etapas relevantes, tips específicos y catálogo de núcleos contextual. Puedes cambiar después en tu perfil.</p>
        </div>

        <div class="fm-species-grid">
          ${this.CATALOGO.map(s => this.renderCard(s)).join("")}
        </div>

        <div class="fm-species-modal-footer">
          <small>💡 Esta selección se guarda automáticamente en tu cuenta</small>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    // Event listeners
    modal.querySelectorAll(".species-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.dataset.especie;
        this.setActiva(id);
        // Animación de salida
        modal.classList.add("closing");
        setTimeout(() => {
          modal.remove();
          document.body.style.overflow = "";
          // Trigger callback si existe
          if (typeof window.onEspecieElegida === "function") {
            window.onEspecieElegida(id);
          }
          // Reload para que filtrado tome efecto
          if (window.fmToast) {
            const especie = this.CATALOGO.find(s => s.id === id);
            window.fmToast(`¡Listo! Modo ${especie.nombre} activado`, "success");
          }
          // Reload la pagina para aplicar filtros
          setTimeout(() => location.reload(), 600);
        }, 300);
      });
    });

    // Animación de entrada
    requestAnimationFrame(() => {
      modal.classList.add("active");
    });
  },

  // ============================================
  // BANNER MODO ACTIVO (topbar)
  // ============================================
  renderBanner() {
    const activa = this.getActiva();
    if (!activa) return "";

    return `
      <button type="button" class="fm-mode-banner" id="fmModeBanner" style="--mode-color:${activa.color};--mode-bg:${activa.colorBg};">
        <span class="fm-mode-icon">${activa.icon}</span>
        <span class="fm-mode-text">
          <strong>Modo ${activa.nombre}</strong>
          <small>Click para cambiar</small>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    `;
  },

  // Inyecta el banner en el topbar de cualquier página
  injectBanner() {
    if (!this.getActiva()) return;
    const topbar = document.querySelector(".app-topbar");
    if (!topbar) return;
    if (document.getElementById("fmModeBanner")) return; // ya existe

    // Inyectar estilos
    if (!document.getElementById("fm-species-styles")) {
      const style = document.createElement("style");
      style.id = "fm-species-styles";
      style.textContent = this._getStyles();
      document.head.appendChild(style);
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.renderBanner();
    const banner = wrapper.firstElementChild;
    topbar.appendChild(banner);

    banner.addEventListener("click", () => this.mostrarOnboarding(true));
  },

  // ============================================
  // ESTILOS (inyectados dinámicamente)
  // ============================================
  _getStyles() {
    return `
      .fm-species-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 52, 87, 0.65);
        backdrop-filter: blur(12px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
      }

      .fm-species-modal-backdrop.active {
        opacity: 1;
      }

      .fm-species-modal-backdrop.closing {
        opacity: 0;
      }

      .fm-species-modal {
        background: white;
        border-radius: 24px;
        max-width: 1100px;
        width: 100%;
        max-height: 95vh;
        overflow-y: auto;
        box-shadow: 0 30px 80px rgba(0,0,0,0.4);
        transform: scale(0.95) translateY(20px);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .fm-species-modal-backdrop.active .fm-species-modal {
        transform: scale(1) translateY(0);
      }

      .fm-species-modal-header {
        text-align: center;
        padding: 48px 48px 24px;
        background: linear-gradient(180deg, #FAFAF9 0%, #FFFFFF 100%);
        border-radius: 24px 24px 0 0;
      }

      @media (max-width: 640px) {
        .fm-species-modal-header { padding: 32px 24px 20px; }
      }

      .fm-species-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: rgba(245, 158, 11, 0.12);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #B45309;
        margin-bottom: 16px;
      }

      .fm-species-modal-header h2 {
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-weight: 800;
        color: #0F172A;
        margin: 0 0 12px;
        letter-spacing: -0.02em;
        line-height: 1.15;
      }

      .fm-species-modal-header p {
        font-size: 1rem;
        color: #64748B;
        max-width: 640px;
        margin: 0 auto;
        line-height: 1.55;
      }

      .fm-species-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding: 32px 48px;
      }

      @media (max-width: 900px) {
        .fm-species-grid { grid-template-columns: repeat(2, 1fr); padding: 24px; }
      }
      @media (max-width: 540px) {
        .fm-species-grid { grid-template-columns: 1fr; padding: 20px; gap: 12px; }
      }

      .species-card {
        background: white;
        border: 2px solid #E5E7EB;
        border-radius: 16px;
        padding: 0;
        cursor: pointer;
        text-align: left;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        font-family: inherit;
        display: flex;
        flex-direction: column;
      }

      .species-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--species-bg);
        opacity: 0;
        transition: opacity 0.25s;
        pointer-events: none;
        z-index: 0;
      }

      .species-card:hover {
        border-color: var(--species-color);
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
      }

      .species-card:hover::before {
        opacity: 0.5;
      }

      .species-card:active {
        transform: translateY(-2px);
      }

      .species-card-image {
        width: 100%;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: var(--species-bg);
        position: relative;
        z-index: 1;
      }

      .species-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
      }

      .species-card:hover .species-card-image img {
        transform: scale(1.05);
      }

      .species-card-content {
        padding: 16px 18px 50px;
        position: relative;
        z-index: 1;
        flex: 1;
      }

      .species-card-name {
        font-size: 1.0625rem;
        font-weight: 800;
        color: #0F172A;
        margin-bottom: 4px;
        letter-spacing: -0.01em;
      }

      .species-card-desc {
        font-size: 0.8125rem;
        color: #475569;
        margin-bottom: 6px;
        line-height: 1.4;
      }

      .species-card-tagline {
        font-size: 0.75rem;
        color: var(--species-color);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .species-card-arrow {
        position: absolute;
        bottom: 14px;
        right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--species-color);
        color: white;
        display: grid;
        place-items: center;
        opacity: 0;
        transform: translateX(-8px);
        transition: all 0.25s;
        z-index: 2;
      }

      .species-card:hover .species-card-arrow {
        opacity: 1;
        transform: translateX(0);
      }

      .fm-species-modal-footer {
        text-align: center;
        padding: 16px 48px 32px;
        border-top: 1px solid #F1F5F9;
        color: #64748B;
        font-size: 0.875rem;
      }

      /* ============================================
         BANNER DE MODO ACTIVO
         ============================================ */
      .fm-mode-banner {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 6px 14px 6px 8px;
        background: var(--mode-bg, #F1F5F9);
        border: 1.5px solid color-mix(in srgb, var(--mode-color, #1B4D7C) 30%, transparent);
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
        margin-left: auto;
      }

      .fm-mode-banner:hover {
        border-color: var(--mode-color, #1B4D7C);
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
      }

      .fm-mode-icon {
        width: 32px;
        height: 32px;
        background: white;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 1.125rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      }

      .fm-mode-text {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }

      .fm-mode-text strong {
        font-size: 0.8125rem;
        font-weight: 700;
        color: var(--mode-color, #0F172A);
      }

      .fm-mode-text small {
        font-size: 0.6875rem;
        color: #64748B;
      }

      @media (max-width: 600px) {
        .fm-mode-text small { display: none; }
      }
    `;
  }
};

// Auto-inicialización: si la página tiene topbar y hay especie activa, inyectar banner
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => window.FM_SPECIES.injectBanner(), 100);
  });
} else {
  setTimeout(() => window.FM_SPECIES.injectBanner(), 100);
}
