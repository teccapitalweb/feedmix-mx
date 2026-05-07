// ============================================
// FeedMix MX — Sistema de Instrucciones de Uso
// Tooltips, ayudas contextuales y guías paso-a-paso
// ============================================

window.FM_GUIDE = {

  // Tooltips por elemento (data-fm-tip="key")
  TOOLTIPS: {
    // Formulador
    "formulador-cliente": "Nombre del cliente o referencia del lote. Aparece en el PDF que entregas al granjero.",
    "formulador-tipo": "Tipo de ave que vas a alimentar. Define los requerimientos NRC de base.",
    "formulador-raza": "Raza específica del ave. Cada raza tiene sus propios objetivos de productividad.",
    "formulador-etapa": "Etapa de vida del ave. Los requerimientos cambian según edad/peso.",
    "formulador-volumen": "Cuánto alimento vas a producir. 1 ton = 1,000 kg.",
    "formulador-unidad": "Cambia entre kg (volumen pequeño) y ton (volumen industrial).",
    "formulador-ingredientes": "Marca los ingredientes que tienes disponibles en bodega. Solo estos se usarán para optimizar.",
    "formulador-precio": "Precio por kg actual. Actualízalo cada lunes para ahorrar dinero real.",
    "formulador-min": "Inclusión mínima del ingrediente (%). Útil para forzar uso (ej. 20% mínimo de maíz).",
    "formulador-max": "Inclusión máxima del ingrediente (%). Útil para limitar (ej. máximo 8% DDGS).",
    "formulador-optimizar": "Calcula automáticamente la mezcla más barata que cumple los requerimientos NRC.",
    "formulador-guardar": "Guarda esta fórmula en tu historial para reusarla o duplicarla después.",
    "formulador-pdf": "Genera un PDF profesional con tu marca para entregar al granjero.",
    "formulador-sacos": "Calcula cuántos sacos necesitas comprar de cada ingrediente.",
    "formulador-receta": "Vista paso a paso para el operador de la mezcladora.",
    "formulador-comparar": "Compara tu fórmula con el alimento comprado del proveedor.",

    // Ingredientes
    "ing-em": "Energía Metabolizable (kcal/kg). El 'combustible' del ave.",
    "ing-pc": "Proteína Cruda (%). Para crecimiento muscular y huevo.",
    "ing-ca": "Calcio (%). Crítico para huesos y cáscara de huevo.",
    "ing-p": "Fósforo disponible (%). Para huesos y metabolismo energético.",
    "ing-lys": "Lisina digestible (%). El aminoácido más limitante en avicultura.",
    "ing-precio": "Precio actual por kg. Edita cada semana para optimizaciones reales.",
    "ing-nuevo": "Agrega un insumo personalizado que no esté en la lista base.",

    // Núcleos
    "nucleo-inclusion": "Porcentaje del núcleo en la fórmula final. Menor inclusión = más concentrado.",
    "nucleo-detector": "Te sugiere el núcleo ideal según tipo + raza + etapa + presupuesto.",
    "nucleo-presupuesto": "Económico = más barato | Balanceado = relación precio/calidad | Premium = mejor tecnología.",

    // Historial
    "hist-duplicar": "Crea una copia de esta fórmula para reoptimizarla con precios actualizados.",
    "hist-pdf": "Vuelve a generar el PDF de esta fórmula guardada.",
    "hist-eliminar": "Borra esta fórmula del historial (no se puede deshacer).",

    // General
    "stat-formulas": "Cuántas fórmulas has creado en total.",
    "stat-ahorro": "Estimación del ahorro acumulado vs comprar alimento terminado.",
    "stat-toneladas": "Toneladas totales de alimento que has formulado."
  },

  // ============================================
  // INICIALIZA TOOLTIPS EN LA PÁGINA
  // Aplica automáticamente a [data-fm-tip="key"]
  // ============================================
  init() {
    // Estilos inline (una sola vez)
    if (!document.getElementById("fm-guide-styles")) {
      const style = document.createElement("style");
      style.id = "fm-guide-styles";
      style.textContent = `
        [data-fm-tip] { position: relative; cursor: help; }
        [data-fm-tip]::after {
          content: attr(data-fm-tip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: #1B4D7C;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1.4;
          white-space: normal;
          width: max-content;
          max-width: 260px;
          text-align: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s, transform 0.2s;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(15, 52, 87, 0.3);
        }
        [data-fm-tip]::before {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-2px);
          border: 5px solid transparent;
          border-top-color: #1B4D7C;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          z-index: 1000;
        }
        [data-fm-tip]:hover::after,
        [data-fm-tip]:hover::before {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }
        [data-fm-tip]:hover::before {
          transform: translateX(-50%) translateY(-2px);
        }

        /* Help icon button */
        .fm-help-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--neutral-100, #F1F5F9);
          color: var(--neutral-500, #64748B);
          font-size: 11px;
          font-weight: 700;
          cursor: help;
          margin-left: 6px;
          border: none;
          vertical-align: middle;
          transition: all 0.15s;
        }
        .fm-help-btn:hover {
          background: var(--primary, #1B4D7C);
          color: white;
        }

        /* Pulsing hint dot */
        .fm-hint-pulse {
          position: relative;
        }
        .fm-hint-pulse::after {
          content: "";
          position: absolute;
          top: -4px;
          right: -4px;
          width: 10px;
          height: 10px;
          background: #F59E0B;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6);
          animation: fmPulse 2s infinite;
          pointer-events: none;
        }
        @keyframes fmPulse {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
          70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
      `;
      document.head.appendChild(style);
    }

    // Convertir data-fm-tip="key" a tooltips reales
    document.querySelectorAll('[data-fm-tip]').forEach(el => {
      const key = el.getAttribute('data-fm-tip');
      const text = this.TOOLTIPS[key] || key;
      el.setAttribute('data-fm-tip', text);
    });
  },

  // Crea un botón de ayuda (?)
  helpButton(key) {
    const text = this.TOOLTIPS[key] || key;
    return `<button type="button" class="fm-help-btn" data-fm-tip="${text}" tabindex="-1" aria-label="Ayuda">?</button>`;
  }
};

// Auto-init cuando carga el DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => window.FM_GUIDE.init());
} else {
  window.FM_GUIDE.init();
}
