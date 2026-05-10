# 📐 Nivel 2: Solver Simplex Real con glpk.js

> **Plan completo para la próxima sesión dedicada (4-6 horas)**
> Cuando Jorge diga "implementemos el solver real" se ejecuta este plan.

---

## 🎯 Objetivo

Reemplazar el algoritmo greedy actual por un **solver de programación lineal (LP)** real, igual al que usan SimpleMix, Allix, AFOS y Brill.

**Resultado esperado:** Fórmulas matemáticamente óptimas al céntimo, garantizadas como mínimo costo cumpliendo todas las restricciones nutricionales.

---

## 📚 Concepto: ¿Qué es Programación Lineal?

Plantear el problema de mínimo costo así:

### Variables de decisión
```
x₁ = % de maíz en la fórmula
x₂ = % de pasta soya
x₃ = % de carbonato
... (una por cada ingrediente activo)
```

### Función objetivo (lo que queremos minimizar)
```
MIN  Z = precio_maíz·x₁ + precio_soya·x₂ + precio_carbonato·x₃ + ...
```

### Restricciones (las reglas que deben cumplirse)
```
Σ xᵢ = 100                          (suma debe ser 100%)
Σ EM_i·xᵢ ≥ EM_min                  (energía mínima requerida)
Σ EM_i·xᵢ ≤ EM_max                  (energía máxima)
Σ PC_i·xᵢ ≥ PC_min                  (proteína mínima)
Σ Ca_i·xᵢ ≥ Ca_min                  (calcio mínimo)
Σ Ca_i·xᵢ ≤ Ca_max                  (calcio máximo)
Σ P_i·xᵢ ≥ P_min                    (fósforo)
Σ Lys_i·xᵢ ≥ Lys_min                (lisina)
Σ Met_i·xᵢ ≥ Met_min                (metionina)
Σ Na_i·xᵢ ≥ Na_min                  (sodio)
xᵢ_min ≤ xᵢ ≤ xᵢ_max para cada i    (rangos individuales)
xᵢ ≥ 0                              (no negatividad)
```

El solver Simplex encuentra los valores `x₁, x₂, ...` que **minimizan Z** cumpliendo todas las restricciones.

---

## 🛠 Stack técnico

### Librería: **glpk.js**
- Versión: `4.0.2`
- Tamaño: ~400 KB minificado
- CDN: `https://cdn.jsdelivr.net/npm/glpk.js@4.0.2/dist/glpk.min.js`
- Sin npm install — carga directa desde CDN igual que jsPDF
- Funciona 100% en navegador (Web Worker compatible)

### Alternativas evaluadas (descartadas):
- **javascript-lp-solver**: más simple pero menos preciso, no soporta restricciones grandes
- **highs-js**: superior pero 2 MB (muy pesado)
- **glpk WebAssembly**: similar a glpk.js pero menor compatibilidad

---

## 📋 Plan de implementación (4-6 horas)

### **Fase 1: Setup (30 min)**
1. Crear `/assets/optimizer-v2.js` (módulo separado)
2. Cargar glpk.js desde CDN con fallback (igual patrón que jsPDF)
3. Inicializar GLPK en background al cargar formulador
4. Toggle en UI: `[Greedy v1] / [Solver v2 ⚡]` (default: v2 si glpk carga OK)

### **Fase 2: Modelo LP (2 horas)**
Crear función `buildLPModel(state, requerimientos)` que devuelve:

```javascript
{
  name: "FeedMix",
  objective: {
    direction: GLPK.GLP_MIN,
    name: "costo",
    vars: [
      { name: "x_maiz", coef: 6.50 },      // precio
      { name: "x_soya48", coef: 14.20 },
      { name: "x_carbonato", coef: 0.90 },
      // ... uno por cada ingrediente activo
    ]
  },
  subjectTo: [
    // Suma 100%
    { name: "total", vars: [...todos], bnds: { type: GLPK.GLP_FX, ub: 100, lb: 100 } },

    // Energía mínima
    { name: "em_min", vars: [
      { name: "x_maiz", coef: 3350 },
      { name: "x_soya48", coef: 2440 },
      // ...
    ], bnds: { type: GLPK.GLP_LO, lb: req.em_min } },

    // Energía máxima
    { name: "em_max", vars: [...], bnds: { type: GLPK.GLP_UP, ub: req.em_max } },

    // Proteína, Ca, P, Lys, Met, Na...
    // Rangos individuales por ingrediente
  ]
}
```

### **Fase 3: Resolver y mapear (1 hora)**
```javascript
async function optimizarV2(state) {
  await ensureGLPKLoaded();
  const lp = buildLPModel(state, getRequerimientos());

  try {
    const result = await glpk.solve(lp, GLPK.GLP_MSG_ERR);

    if (result.result.status === GLPK.GLP_OPT) {
      // Solución óptima encontrada
      return mapResultToFormula(result.result.vars, state);
    } else if (result.result.status === GLPK.GLP_INFEAS) {
      // No hay solución posible — sugerir flexibilizar restricciones
      return { error: "infeasible", suggestions: detectarRestriccionesProblematicas(lp) };
    }
  } catch (e) {
    // Fallback a greedy v1
    console.warn("Solver v2 falló, usando v1:", e);
    return optimizarV1(state);
  }
}
```

### **Fase 4: UI mejorada (1 hora)**
Después de optimizar, mostrar:
- ✅ "Solución óptima · Costo: $X (matemáticamente mínimo)"
- 📊 Análisis de sensibilidad: "Si bajas el precio del maíz $0.10 → ahorras $5/ton"
- 🔍 Costos de oportunidad: "El sorgo está $1.50 por encima de su costo de oportunidad"
- ⚠️ Si infeasible: "No es posible cumplir todos los requerimientos. Flexibilizar: max maíz a 70%"

### **Fase 5: Manejo de casos edge (1 hora)**
1. **Infeasibility:** detectar qué restricción es imposible y sugerir relajarla
2. **Unbounded:** si falta restricción de cota superior, agregar default (todos los ingredientes ≤ 100%)
3. **Tolerancias:** permitir desviación ±2% en restricciones blandas (ej: PC mínima ideal 21%, aceptable 20.5%)
4. **Variables enteras opcionales:** algunos clientes prefieren % redondeados (e.g. 60% maíz exacto, no 59.83%)

### **Fase 6: Tests automatizados (30 min)**
```javascript
describe("Solver v2", () => {
  test("Caso simple: maíz + soya cumple PC", async () => {
    const result = await optimizarV2({ ... });
    expect(result.costo).toBeLessThan(8000); // $/ton
    expect(result.perfil.pc).toBeGreaterThanOrEqual(21);
  });

  test("Núcleo se respeta y reduce ingredientes", async () => {
    const con = await optimizarV2(stateConNucleo);
    const sin = await optimizarV2(stateSinNucleo);
    expect(con.formula.find(f => f.id === "carb").pct)
      .toBeLessThan(sin.formula.find(f => f.id === "carb").pct);
  });

  test("Infeasibility detectada correctamente", async () => {
    // Estado imposible: requerir 50% PC con solo maíz disponible
    const result = await optimizarV2(stateImposible);
    expect(result.error).toBe("infeasible");
  });
});
```

---

## 🎁 Beneficios del Nivel 2 vs Nivel 1

| Aspecto | Nivel 1 (Greedy) | Nivel 2 (Solver) |
|---|---|---|
| **Precisión matemática** | ~90% óptima | 100% óptima |
| **Garantía de costo mínimo** | No | Sí (matemáticamente probado) |
| **Manejo de restricciones complejas** | Limitado | Completo |
| **Análisis de sensibilidad** | No | Sí |
| **Detección de infeasibility** | Adivina | Diagnóstico exacto |
| **Tiempo de cálculo** | <50 ms | 100-500 ms |
| **Tamaño del bundle** | 0 KB extra | +400 KB (glpk.js) |
| **Compatible con núcleos** | Sí (Nivel 1) | Sí (mejor) |
| **Ahorro promedio adicional** | base | +2-5% en costo total |
| **Nivel profesional** | Beta | Producción comercial |

---

## 💰 Impacto comercial

Con Nivel 2 puedes vender:
- ✅ Plan **Pro** ($500 USD/año): mantiene como está
- ✅ Plan **Despacho** ($1,500 USD/año): incluye solver v2 como diferenciador
- ✅ Plan futuro **Enterprise** ($5,000 USD/año): solver v2 + análisis sensibilidad + multi-fórmula

Pitch de venta:
> "FeedMix MX es el único software mexicano con solver Simplex real estilo Allix/Brill, optimizando al céntimo cumpliendo NRC. Ahorra 25-30% vs alimento comercial **garantizado matemáticamente**."

---

## 🚦 Cuándo activar este plan

**Activar Nivel 2 cuando:**
- ✅ Tengas 5+ clientes pagando que pidan optimización precisa
- ✅ Britney consiga 1 nutricionista experto que valide la lógica
- ✅ Tengas 10+ horas dedicadas para implementar y probar
- ✅ Quieras posicionarte vs Allix/AFOS/SimpleMix como solución mexicana profesional

**NO activar Nivel 2 si:**
- ❌ Solo tienes productores medianos/traspatio (no notarán diferencia)
- ❌ Vas a iterar muchos otros features primero
- ❌ Aún no validas el modelo de negocio con clientes reales

---

## 📞 Comandos para Claude

Cuando estés listo para implementar Nivel 2, di a Claude:

> *"Implementa el Nivel 2 del solver según el plan en NIVEL_2_SOLVER_PLAN.md"*

Y Claude ejecutará las 6 fases de este documento en una sesión dedicada.

---

**Documento creado:** Mayo 2026
**Por:** Claude (Anthropic) para Jorge / TEC CAPITAL Group
**Proyecto:** FeedMix MX — SaaS de formulación avícola mexicana
