// ============================================
// FeedMix MX — Aminograma completo (8 aminoácidos esenciales)
// ============================================
// Fuentes oficiales:
//  - NRC 9ª edición (Nutrient Requirements of Poultry, 1994)
//  - Tablas Brasileñas para Aves y Cerdos — Rostagno et al. (5ª ed., 2017)
//  - Aviagen Ross 308 Nutrition Specifications (2022)
//  - Cobb 500 Broiler Performance & Nutrition Supplement (2022)
//  - Hy-Line W-36 / W-80 / Brown Management Guide (2018-2020)
//  - Lohmann LSL/Brown Management Guide (2021)
//  - Aviagen Nicholas Select Commercial Performance Goals (V5, 2024)
//  - INRA-AFZ Tables of Composition (2004)
//
// Valores expresados en % del producto tal cual (no en base seca)
// Aminoácidos = TOTALES (no digestibles); para ratios usar TOTAL/TOTAL
// ============================================

(function(){
  "use strict";

  // ============================================
  // PARTE A — APORTES DE AA POR INGREDIENTE
  // ============================================
  // Solo los 6 AA que NO están en el array INGREDIENTES del formulador
  // (metcys, thr, trp, arg, val, ile)
  // Los AA lys y met ya vienen del catálogo base.
  //
  // Key = id del ingrediente en formulador.html
  // ============================================
  var APORTES = {
    // ===== CEREALES =====
    "maiz":    { metcys: 0.36, thr: 0.29, trp: 0.06, arg: 0.40, val: 0.40, ile: 0.28 },
    "sorgo":   { metcys: 0.32, thr: 0.30, trp: 0.10, arg: 0.36, val: 0.46, ile: 0.36 },
    "trigo":   { metcys: 0.50, thr: 0.36, trp: 0.15, arg: 0.55, val: 0.55, ile: 0.42 },
    "cebada":  { metcys: 0.42, thr: 0.36, trp: 0.13, arg: 0.54, val: 0.54, ile: 0.40 },

    // ===== PROTEÍNAS =====
    "soya48":  { metcys: 1.42, thr: 1.85, trp: 0.65, arg: 3.45, val: 2.27, ile: 2.15 },
    "soya44":  { metcys: 1.30, thr: 1.70, trp: 0.60, arg: 3.20, val: 2.10, ile: 2.00 },
    "harpez":  { metcys: 2.20, thr: 2.62, trp: 0.70, arg: 3.65, val: 3.10, ile: 2.65 },
    "harcarn": { metcys: 1.10, thr: 1.60, trp: 0.30, arg: 3.45, val: 2.30, ile: 1.50 },
    "canola":  { metcys: 1.50, thr: 1.55, trp: 0.45, arg: 2.10, val: 1.85, ile: 1.40 },
    "gluten":  { metcys: 2.40, thr: 2.00, trp: 0.30, arg: 1.85, val: 2.85, ile: 2.40 },
    "harpluma":{ metcys: 4.00, thr: 3.65, trp: 0.60, arg: 5.25, val: 5.30, ile: 3.20 },

    // ===== SUBPRODUCTOS =====
    "ddgs":    { metcys: 1.00, thr: 1.00, trp: 0.20, arg: 1.15, val: 1.35, ile: 1.00 },
    "salv":    { metcys: 0.40, thr: 0.50, trp: 0.25, arg: 1.15, val: 0.75, ile: 0.50 },
    "alfa":    { metcys: 0.50, thr: 0.70, trp: 0.30, arg: 0.80, val: 0.85, ile: 0.70 },

    // ===== ENERGÉTICOS (todos cero AA) =====
    "aceite":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "sebo":    { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "melaza":  { metcys: 0, thr: 0.10, trp: 0, arg: 0, val: 0.20, ile: 0.10 },
    "grasaa":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },

    // ===== MINERALES (todos cero AA) =====
    "carb":    { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "fosf":    { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "fosbi":   { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "sal":     { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "bicarb":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },

    // ===== AMINOÁCIDOS SINTÉTICOS =====
    // DL-Met aporta también a Met+Cys (Met es el componente azufrado limitante)
    "metio":   { metcys: 99.0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    // L-Lisina HCl: solo aporta Lys (ya en INGREDIENTES base)
    "lisina":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    // L-Treonina 98%
    "treo":    { metcys: 0, thr: 98.0, trp: 0, arg: 0, val: 0, ile: 0 },

    // ===== ADITIVOS (todos cero AA) =====
    "premix":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "fitasa":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "colina":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 },
    "coccid":  { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 }
  };

  // ============================================
  // PARTE B — REQUERIMIENTOS AA POR ETAPA (los 3 que faltan: arg, val, ile)
  // ============================================
  // Los AA lys, met, metcys, thr, trp ya vienen de avicola-data.js (etapa.req)
  // Aquí solo completamos arg, val, ile en % del alimento.
  //
  // Key = id de etapa (debe coincidir con avicola-data.js)
  // ============================================
  var REQ_AA_EXTRA = {
    // ====== ENGORDA (Ross 308 / Cobb 500 — base AA totales) ======
    "preiniciador": { arg: 1.49, val: 1.10, ile: 0.95 },
    "iniciador":    { arg: 1.39, val: 1.02, ile: 0.88 },
    "crecimiento":  { arg: 1.24, val: 0.91, ile: 0.79 },
    "finalizador":  { arg: 1.10, val: 0.81, ile: 0.70 },
    "retiro":       { arg: 1.05, val: 0.77, ile: 0.67 },

    // ====== PONEDORAS (Hy-Line W-36 / Lohmann LSL) ======
    "pollita-ini":  { arg: 1.21, val: 0.96, ile: 0.84 },
    "pollita-crec": { arg: 0.96, val: 0.78, ile: 0.68 },
    "pollona-des":  { arg: 0.77, val: 0.62, ile: 0.55 },
    "prepostura":   { arg: 0.88, val: 0.72, ile: 0.66 },
    "fase1":        { arg: 0.95, val: 0.76, ile: 0.69 },
    "fase2":        { arg: 0.88, val: 0.70, ile: 0.64 },
    "fase3":        { arg: 0.82, val: 0.66, ile: 0.60 },

    // ====== REPRODUCTORAS ======
    "rep-ini":      { arg: 1.39, val: 1.02, ile: 0.88 },
    "rep-crec":     { arg: 1.05, val: 0.77, ile: 0.67 },
    "rep-des":      { arg: 0.85, val: 0.66, ile: 0.56 },
    "rep-prepost":  { arg: 0.95, val: 0.76, ile: 0.69 },
    "rep-pico":     { arg: 1.00, val: 0.80, ile: 0.72 },
    "rep-media":    { arg: 0.95, val: 0.76, ile: 0.69 },
    "rep-final":    { arg: 0.88, val: 0.70, ile: 0.64 },

    // ====== PAVOS (Nicholas Select / B.U.T.) ======
    "pavo-preini":  { arg: 1.85, val: 1.30, ile: 1.10 },
    "pavo-ini":     { arg: 1.65, val: 1.20, ile: 1.05 },
    "pavo-crec":    { arg: 1.50, val: 1.05, ile: 0.95 },
    "pavo-des":     { arg: 1.30, val: 0.95, ile: 0.85 },
    "pavo-fin":     { arg: 1.15, val: 0.85, ile: 0.75 },
    "pavo-acab":    { arg: 1.00, val: 0.75, ile: 0.65 },

    // ====== DOBLE PROPÓSITO / CRIOLLA ======
    "dp-ini":       { arg: 1.20, val: 0.85, ile: 0.75 },
    "dp-crec":      { arg: 1.00, val: 0.75, ile: 0.65 },
    "dp-post":      { arg: 0.90, val: 0.72, ile: 0.65 },
    "dp-mant":      { arg: 0.75, val: 0.60, ile: 0.55 },

    // ====== NRC GENÉRICO ======
    "nrc-ini":      { arg: 1.25, val: 0.90, ile: 0.80 },
    "nrc-crec":     { arg: 1.10, val: 0.82, ile: 0.73 },
    "nrc-fin":      { arg: 1.00, val: 0.75, ile: 0.65 }
  };

  // ============================================
  // PARTE C — RATIOS DE PROTEÍNA IDEAL POR TIPO (Lys = 100)
  // Útiles para detectar desequilibrios y AA limitantes
  // ============================================
  var RATIOS_IDEALES = {
    engorda:        { met: 38, metcys: 74, thr: 65, trp: 17, arg: 105, val: 77, ile: 67 },
    ponedora:       { met: 47, metcys: 88, thr: 73, trp: 20, arg: 110, val: 88, ile: 80 },
    reproductora:   { met: 42, metcys: 80, thr: 68, trp: 18, arg: 108, val: 80, ile: 70 },
    pavo:           { met: 38, metcys: 75, thr: 64, trp: 16, arg: 108, val: 78, ile: 65 },
    doble_proposito:{ met: 40, metcys: 78, thr: 68, trp: 18, arg: 105, val: 80, ile: 72 },
    generico:       { met: 40, metcys: 75, thr: 65, trp: 17, arg: 105, val: 77, ile: 67 }
  };

  // ============================================
  // PARTE D — NOMBRES Y SÍMBOLOS DE LOS 8 AA
  // ============================================
  var AA_LIST = [
    { key: "lys",    nombre: "Lisina",            simbolo: "Lys", color: "#3B82F6" },
    { key: "met",    nombre: "Metionina",         simbolo: "Met", color: "#F59E0B" },
    { key: "metcys", nombre: "Metionina+Cistina", simbolo: "M+C", color: "#D97706" },
    { key: "thr",    nombre: "Treonina",          simbolo: "Thr", color: "#10B981" },
    { key: "trp",    nombre: "Triptófano",        simbolo: "Trp", color: "#8B5CF6" },
    { key: "arg",    nombre: "Arginina",          simbolo: "Arg", color: "#EC4899" },
    { key: "val",    nombre: "Valina",            simbolo: "Val", color: "#06B6D4" },
    { key: "ile",    nombre: "Isoleucina",        simbolo: "Ile", color: "#F43F5E" }
  ];

  // ============================================
  // API
  // ============================================
  window.FM_AMINO = {

    AA_LIST: AA_LIST,
    APORTES: APORTES,
    REQ_AA_EXTRA: REQ_AA_EXTRA,
    RATIOS_IDEALES: RATIOS_IDEALES,

    /**
     * Devuelve los aportes de los 6 AA extra para un ingrediente
     * @param {string} ingId - ID del ingrediente
     * @returns {object} - { metcys, thr, trp, arg, val, ile }
     */
    getAporteIngrediente: function(ingId){
      return APORTES[ingId] || { metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 };
    },

    /**
     * Combina los requerimientos de avicola-data.js (lys, met, metcys, thr, trp)
     * con los AA extra (arg, val, ile) por etapa.
     * @param {string} etapaId - id de la etapa
     * @param {object} reqBase - el .req de la etapa (de avicola-data.js)
     * @returns {object} - { lys, met, metcys, thr, trp, arg, val, ile }
     */
    getRequerimientoCompleto: function(etapaId, reqBase){
      var extra = REQ_AA_EXTRA[etapaId] || { arg: 0, val: 0, ile: 0 };
      return {
        lys:    reqBase.lys    || 0,
        met:    reqBase.met    || 0,
        metcys: reqBase.metcys || 0,
        thr:    reqBase.thr    || 0,
        trp:    reqBase.trp    || 0,
        arg:    extra.arg      || 0,
        val:    extra.val      || 0,
        ile:    extra.ile      || 0
      };
    },

    /**
     * Calcula los aportes totales de los 8 AA en la fórmula resultante.
     * @param {Array} formula - array de { ing: {id, lys, met, ...}, pct: 12.5 }
     * @returns {object} - { lys, met, metcys, thr, trp, arg, val, ile } en % del alimento
     */
    calcularAportes: function(formula){
      var ap = { lys: 0, met: 0, metcys: 0, thr: 0, trp: 0, arg: 0, val: 0, ile: 0 };
      if (!formula || !Array.isArray(formula)) return ap;

      formula.forEach(function(f){
        var ing = f.ing || f;
        var pct = (f.pct !== undefined ? f.pct : (f.porcentaje || 0));
        var factor = pct / 100;
        // Si es núcleo, manejo especial
        if (ing.isNucleo && window.FM_NUCLEOS) {
          var nd = window.FM_NUCLEOS.CATALOGO.find(function(n){ return "nucleo_" + n.id === ing.id; });
          if (nd && nd.aportes) {
            ap.lys += factor * (nd.aportes.lys || 0);
            ap.met += factor * (nd.aportes.met || 0);
            // Los núcleos típicamente reportan solo lys y met; los demás AA del núcleo
            // se consideran despreciables (es un mineral-vitamínico con AA sintéticos puntuales)
            ap.metcys += factor * (nd.aportes.met || 0); // Met cuenta también como Met+Cys
            ap.thr += factor * (nd.aportes.thr || 0);
            ap.trp += factor * (nd.aportes.trp || 0);
            ap.arg += factor * (nd.aportes.arg || 0);
            ap.val += factor * (nd.aportes.val || 0);
            ap.ile += factor * (nd.aportes.ile || 0);
          }
        } else {
          var extra = APORTES[ing.id] || {};
          ap.lys    += factor * (ing.lys || 0);
          ap.met    += factor * (ing.met || 0);
          // Met+Cys = Met + Cys; el aporte de met aún se cuenta, más el cys del ingrediente
          // Como Met+Cys ya engloba Met en la tabla, sumamos directamente el valor combinado
          ap.metcys += factor * (extra.metcys || 0);
          ap.thr    += factor * (extra.thr || 0);
          ap.trp    += factor * (extra.trp || 0);
          ap.arg    += factor * (extra.arg || 0);
          ap.val    += factor * (extra.val || 0);
          ap.ile    += factor * (extra.ile || 0);
        }
      });

      // Para Met+Cys, si la fórmula tiene DL-Met (id "metio"), su aporte ya va en metcys.
      // El valor de met no se suma al metcys porque metcys es un valor combinado por ingrediente
      // que ya incluye Met como parte del par azufrado.
      // Verificación de consistencia: Met+Cys SIEMPRE >= Met (excepto error de datos)
      if (ap.metcys < ap.met) ap.metcys = ap.met;

      return ap;
    },

    /**
     * Detecta el aminoácido LIMITANTE — el de menor cobertura vs requerimiento.
     * @param {object} aporte - { lys, met, metcys, ... }
     * @param {object} req - { lys, met, metcys, ... }
     * @returns {object} - { key, nombre, cobertura, deficit }
     */
    detectarLimitante: function(aporte, req){
      var limitante = null;
      var menorCob = Infinity;
      AA_LIST.forEach(function(aa){
        var ap = aporte[aa.key] || 0;
        var rq = req[aa.key] || 0;
        if (rq <= 0) return; // no hay req definido, saltar
        var cob = (ap / rq) * 100;
        if (cob < menorCob) {
          menorCob = cob;
          limitante = {
            key: aa.key,
            nombre: aa.nombre,
            simbolo: aa.simbolo,
            color: aa.color,
            aporte: ap,
            requerido: rq,
            cobertura: cob,
            deficit: Math.max(0, rq - ap)
          };
        }
      });
      return limitante;
    },

    /**
     * Calcula los ratios de cada AA vs Lisina (Lys = 100)
     * @param {object} aporte - aportes de los 8 AA
     * @returns {object} - ratios { met: 38, metcys: 75, ... } y comparado con ideal
     */
    calcularRatios: function(aporte, tipoProduccion){
      var ratios = {};
      var lysVal = aporte.lys || 0.001;
      var ideal = RATIOS_IDEALES[tipoProduccion] || RATIOS_IDEALES.generico;

      AA_LIST.forEach(function(aa){
        if (aa.key === "lys") return;
        var r = (aporte[aa.key] / lysVal) * 100;
        ratios[aa.key] = {
          actual: r,
          ideal: ideal[aa.key],
          diff: r - ideal[aa.key]
        };
      });
      return ratios;
    },

    /**
     * Genera alertas inteligentes contextuales.
     * @param {object} aporte - aportes de los 8 AA (de calcularAportes)
     * @param {object} perfilCompleto - { em, pc, ca, p, lys, met, ... } perfil completo
     * @param {object} req - requerimientos completos
     * @param {string} tipoProduccion - engorda / ponedora / pavo / reproductora / doble_proposito / generico
     * @param {string} etapaId - id de la etapa
     * @param {number} edadDias - edad en días (opcional)
     * @returns {Array} - lista de alertas { severidad, titulo, mensaje, recomendacion }
     */
    generarAlertas: function(aporte, perfilCompleto, req, tipoProduccion, etapaId, edadDias){
      var alertas = [];

      // ===== ALERTA 1: Ratio Met/Lys (clave en proteína ideal) =====
      var lysVal = aporte.lys || 0.001;
      var ratioMetLys = (aporte.met / lysVal) * 100;
      var ideal = RATIOS_IDEALES[tipoProduccion] || RATIOS_IDEALES.generico;
      var idealMet = ideal.met;
      var diffMet = ratioMetLys - idealMet;

      if (Math.abs(diffMet) > 8) {
        alertas.push({
          severidad: diffMet < 0 ? "alta" : "media",
          icono: diffMet < 0 ? "⚠️" : "ℹ️",
          titulo: "Desbalance Met/Lys",
          mensaje: "Tu fórmula tiene ratio Met/Lys de " + ratioMetLys.toFixed(0) + "% (ideal " + idealMet + "%).",
          recomendacion: diffMet < 0
            ? "Aumenta DL-Metionina (id metio) en 0.05-0.10%. La Met deficiente limita el crecimiento aun con Lys suficiente."
            : "Exceso de Met: posible sobrecosto y estrés metabólico. Reduce DL-Metionina ligeramente."
        });
      }

      // ===== ALERTA 2: Ratio EM/PC (densidad energético-proteica) =====
      var pcVal = perfilCompleto.pc || 0.001;
      var ratioEmPc = perfilCompleto.em / pcVal;
      var rangoEmPc = { engorda: [140, 165], ponedora: [145, 165], pavo: [135, 155], reproductora: [135, 155], doble_proposito: [140, 165], generico: [140, 165] };
      var rangoTipo = rangoEmPc[tipoProduccion] || rangoEmPc.generico;

      if (ratioEmPc < rangoTipo[0]) {
        alertas.push({
          severidad: "media",
          icono: "📉",
          titulo: "Ratio EM/PC bajo",
          mensaje: "Tu fórmula tiene " + ratioEmPc.toFixed(0) + " kcal por % de PC (ideal " + rangoTipo[0] + "-" + rangoTipo[1] + ").",
          recomendacion: "Energía insuficiente para utilizar la proteína. Sube aceite/grasa 0.5-1.0% o reduce proteína si la dieta tiene PC excesiva."
        });
      } else if (ratioEmPc > rangoTipo[1]) {
        alertas.push({
          severidad: "baja",
          icono: "📈",
          titulo: "Ratio EM/PC alto",
          mensaje: "Tu fórmula tiene " + ratioEmPc.toFixed(0) + " kcal por % de PC (ideal " + rangoTipo[0] + "-" + rangoTipo[1] + ").",
          recomendacion: "Exceso de energía vs proteína: posible deposición de grasa. Aumenta proteína de calidad o reduce aceite/grasa."
        });
      }

      // ===== ALERTA 3: Tamaño de partícula de calcio según edad (solo ponedoras y reproductoras) =====
      if (tipoProduccion === "ponedora" || tipoProduccion === "reproductora") {
        var etapasFinas    = ["pollita-ini", "pollita-crec", "pollona-des", "rep-ini", "rep-crec", "rep-des"];
        var etapasMixtas   = ["prepostura", "rep-prepost"];
        var etapasGruesas  = ["fase1", "fase2", "fase3", "rep-pico", "rep-media", "rep-final"];

        var recomendacionCa = null;
        if (etapasFinas.indexOf(etapaId) >= 0) {
          recomendacionCa = "100% caliza fina (<1 mm). En crianza/desarrollo el ave no necesita Ca grueso.";
        } else if (etapasMixtas.indexOf(etapaId) >= 0) {
          recomendacionCa = "50% fina + 50% gruesa (2-4 mm). Empieza a preparar la formación del cascarón.";
        } else if (etapasGruesas.indexOf(etapaId) >= 0) {
          recomendacionCa = "30% fina + 70% gruesa (2-4 mm). El Ca grueso libera lentamente y mejora el grosor del cascarón.";
        }

        if (recomendacionCa && (perfilCompleto.ca || 0) > 1.5) {
          alertas.push({
            severidad: "info",
            icono: "🥚",
            titulo: "Tamaño de partícula de calcio",
            mensaje: "Para esta etapa, la presentación del calcio importa tanto como la cantidad.",
            recomendacion: recomendacionCa
          });
        }
      }

      // ===== ALERTA 4: AA limitante con cobertura < 95% =====
      var limit = window.FM_AMINO.detectarLimitante(aporte, req);
      if (limit && limit.cobertura < 95) {
        var sugIng = null;
        if (limit.key === "lys")    sugIng = "L-Lisina HCl (id lisina)";
        else if (limit.key === "met" || limit.key === "metcys") sugIng = "DL-Metionina (id metio)";
        else if (limit.key === "thr") sugIng = "L-Treonina (id treo)";
        else if (limit.key === "trp") sugIng = "Pasta de soya 48% o gluten meal";
        else if (limit.key === "arg") sugIng = "Pasta de soya 48% (rica en arginina)";
        else if (limit.key === "val" || limit.key === "ile") sugIng = "Harina de pescado o pasta de soya 48%";

        alertas.push({
          severidad: "alta",
          icono: "🧪",
          titulo: "AA limitante: " + limit.nombre,
          mensaje: limit.simbolo + " cubre apenas " + limit.cobertura.toFixed(0) + "% del requerimiento (déficit: " + limit.deficit.toFixed(2) + "%).",
          recomendacion: "Aumenta " + (sugIng || "ingrediente rico en " + limit.nombre) + " para corregir. Este es el AA que LIMITA tu producción."
        });
      }

      return alertas;
    }

  };

})();
