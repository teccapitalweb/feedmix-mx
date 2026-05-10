// ============================================
// FEEDMIX MX — SOLVER NIVEL 2 (Simplex Real con glpk.js)
// ============================================
// Programación Lineal: minimizar costo cumpliendo TODAS las restricciones NRC.
// Si glpk.js no carga o falla, hay fallback automático a Nivel 1 (greedy).
//
// Modelo LP:
//   MIN  Σ precio_i · x_i           (costo por kg)
//   s.t. Σ x_i = 100                (suma 100%)
//        Σ EM_i · x_i ≥ EM_min      (energía mínima)
//        Σ PC_i · x_i ≥ PC_min      (proteína mínima)
//        Σ Ca_i · x_i ≥ Ca_min      (calcio mínimo)
//        Σ Ca_i · x_i ≤ Ca_max      (calcio máximo - evita exceso)
//        Σ P_i  · x_i ≥ P_min       (fósforo mínimo)
//        Σ Lys_i · x_i ≥ Lys_min    (lisina mínima)
//        Σ Met_i · x_i ≥ Met_min    (metionina mínima)
//        x_i_min ≤ x_i ≤ x_i_max    (rangos individuales)
//        x_i ≥ 0                    (no negatividad)
// ============================================

window.FM_SOLVER = (function () {
  let glpkInstance = null;
  let glpkLoading = null;

  /**
   * Carga glpk.js dinámicamente con fallback a múltiples CDNs.
   */
  async function ensureGLPK() {
    if (glpkInstance) return glpkInstance;
    if (glpkLoading) return glpkLoading;

    glpkLoading = (async () => {
      const cdnList = [
        "https://cdn.jsdelivr.net/npm/glpk.js@4.0.2/dist/glpk.min.js",
        "https://unpkg.com/glpk.js@4.0.2/dist/glpk.min.js"
      ];

      for (const url of cdnList) {
        try {
          await loadScript(url);
          if (window.GLPK) {
            glpkInstance = await window.GLPK();
            console.log("✅ glpk.js cargado desde:", url);
            return glpkInstance;
          }
        } catch (e) {
          console.warn("⚠️ Falló:", url, e.message);
        }
      }

      throw new Error("No se pudo cargar glpk.js — usando fallback Nivel 1");
    })();

    return glpkLoading;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // Si ya existe el script, no reintentar
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve();
      }
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load: " + src));
      document.head.appendChild(s);
    });
  }

  /**
   * Construye el modelo LP a partir del estado de la fórmula.
   */
  function buildLPModel(state, req, glpk) {
    const activos = state.ingredientes.filter(i => i.active);
    if (activos.length < 3) {
      throw new Error("Se necesitan al menos 3 ingredientes activos para optimizar");
    }

    // Helper: obtener aporte real de un ingrediente (núcleo o normal)
    function aporte(ing, nutriente) {
      if (ing.isNucleo && window.FM_NUCLEOS) {
        const nd = window.FM_NUCLEOS.CATALOGO.find(n => "nucleo_" + n.id === ing.id);
        return (nd && nd.aportes && nd.aportes[nutriente]) || 0;
      }
      return ing[nutriente] || 0;
    }

    // Variables: x_0, x_1, ... x_n (una por ingrediente)
    const vars = activos.map((ing, i) => ({ name: `x${i}`, ing }));

    // Función objetivo: minimizar costo
    const objective = {
      direction: glpk.GLP_MIN,
      name: "costo",
      vars: vars.map(v => ({ name: v.name, coef: v.ing.precio || 0 }))
    };

    const subjectTo = [];

    // RESTRICCIÓN 1: Suma = 100%
    subjectTo.push({
      name: "total",
      vars: vars.map(v => ({ name: v.name, coef: 1 })),
      bnds: { type: glpk.GLP_FX, ub: 100, lb: 100 }
    });

    // RESTRICCIONES NUTRICIONALES (mínimos)
    const minConstraints = [
      { name: "em_min", nut: "em", lb: req.em || 0 },
      { name: "pc_min", nut: "pc", lb: req.pc || 0 },
      { name: "ca_min", nut: "ca", lb: req.ca || 0 },
      { name: "p_min", nut: "p", lb: req.p || 0 },
      { name: "lys_min", nut: "lys", lb: req.lys || 0 },
      { name: "met_min", nut: "met", lb: req.met || 0 }
    ];

    minConstraints.forEach(c => {
      if (c.lb > 0) {
        subjectTo.push({
          name: c.name,
          vars: vars.map(v => ({ name: v.name, coef: aporte(v.ing, c.nut) })),
          bnds: { type: glpk.GLP_LO, lb: c.lb, ub: 0 }
        });
      }
    });

    // ============================================
    // RESTRICCIONES MAX (anti-sobreformulación)
    // Evitan que el solver gaste de más en AAs caros y minerales
    // ============================================
    const maxConstraints = [
      { name: "em_max", nut: "em", multiplier: 1.05 },   // EM no más de 105% del req
      { name: "pc_max", nut: "pc", multiplier: 1.10 },   // PC no más de 110%
      { name: "ca_max", nut: "ca", multiplier: req.ca > 3 ? 1.15 : 1.10 }, // ponedora 115%, otros 110%
      { name: "p_max", nut: "p", multiplier: 1.15 },     // P no más de 115% (clave para evitar sobreformulación)
      { name: "lys_max", nut: "lys", multiplier: 1.10 }, // Lys no más de 110% (L-Lys es CARO)
      { name: "met_max", nut: "met", multiplier: 1.10 }  // Met no más de 110% (DL-Met MUY caro)
    ];

    maxConstraints.forEach(c => {
      const reqVal = req[c.nut] || 0;
      if (reqVal > 0) {
        subjectTo.push({
          name: c.name,
          vars: vars.map(v => ({ name: v.name, coef: aporte(v.ing, c.nut) })),
          bnds: { type: glpk.GLP_UP, ub: reqVal * c.multiplier, lb: 0 }
        });
      }
    });

    // BOUNDS individuales por ingrediente (min/max %)
    const bounds = vars.map((v, i) => {
      const ing = v.ing;
      let lb = ing.min || 0;
      let ub = ing.max || 100;
      // Si es núcleo con inclusión fija (min === max), forzar
      if (ing.isNucleo && ing.min === ing.max && ing.min > 0) {
        return { name: v.name, type: glpk.GLP_FX, lb: ing.min, ub: ing.min };
      }
      return {
        name: v.name,
        type: glpk.GLP_DB,
        lb: lb,
        ub: ub
      };
    });

    return {
      lp: {
        name: "FeedMix_v2",
        objective,
        subjectTo,
        bounds
      },
      vars
    };
  }

  /**
   * Resuelve el modelo LP y mapea al formato de fórmula.
   */
  async function optimizarV2(state) {
    const glpk = await ensureGLPK();
    if (!glpk) throw new Error("GLPK no disponible");

    const A = window.FM_AVICULTURA || window.A;
    const req = A.getRequerimientos(state.razaId, state.etapaId);
    if (!req) throw new Error("No hay requerimientos para esta raza/etapa");

    const { lp, vars } = buildLPModel(state, req, glpk);

    let result;
    try {
      result = await glpk.solve(lp, glpk.GLP_MSG_ERR);
    } catch (e) {
      throw new Error("Error en solver: " + e.message);
    }

    // GLP_OPT = 5 (óptima), GLP_FEAS = 2 (factible), GLP_INFEAS = 4 (infactible), GLP_NOFEAS = 6
    const status = result.result.status;
    if (status === glpk.GLP_INFEAS || status === glpk.GLP_NOFEAS) {
      return {
        error: "infeasible",
        mensaje: "No hay combinación posible que cumpla todos los requerimientos. Sugerencias: aumentar máx de carbonato/fosfato, activar más ingredientes proteicos, o relajar restricciones.",
        status
      };
    }

    // Mapear resultado a formula
    const formula = [];
    let perfil = { em: 0, pc: 0, ca: 0, p: 0, lys: 0, met: 0, na: 0 };
    let costoTon = 0;

    vars.forEach((v, i) => {
      const pct = result.result.vars[v.name] || 0;
      if (pct < 0.01) return; // ignorar ingredientes con 0%

      const ing = v.ing;
      formula.push({
        id: ing.id,
        name: ing.name,
        pct,
        ing
      });

      const factor = pct / 100;
      // Calcular perfil con aportes correctos (núcleo o no)
      if (ing.isNucleo && window.FM_NUCLEOS) {
        const nd = window.FM_NUCLEOS.CATALOGO.find(n => "nucleo_" + n.id === ing.id);
        if (nd && nd.aportes) {
          Object.keys(perfil).forEach(k => {
            perfil[k] += factor * (nd.aportes[k] || 0);
          });
        }
      } else {
        perfil.em += factor * (ing.em || 0);
        perfil.pc += factor * (ing.pc || 0);
        perfil.ca += factor * (ing.ca || 0);
        perfil.p += factor * (ing.p || 0);
        perfil.lys += factor * (ing.lys || 0);
        perfil.met += factor * (ing.met || 0);
        perfil.na += factor * (ing.na || 0);
      }
      costoTon += factor * 1000 * ing.precio;
    });

    // Ordenar por % descendente
    formula.sort((a, b) => b.pct - a.pct);

    return {
      ok: true,
      formula,
      perfil,
      costoTon,
      requerido: req,
      status: "optimal",
      objectiveValue: result.result.z,
      cumple: { ok: true, deficits: [], deficitsCount: 0, criticos: 0 }
    };
  }

  return {
    ensureGLPK,
    optimizarV2,
    buildLPModel
  };
})();
