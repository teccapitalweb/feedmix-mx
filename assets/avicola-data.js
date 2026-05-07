// ============================================
// FeedMix MX — Catálogo completo de razas avícolas
// Datos basados en NRC + manuales de raza (Cobb, Aviagen, Hy-Line, Lohmann, ISA, etc.)
// Adaptado al contexto mexicano
// ============================================

window.FM_AVICOLA = {

  // ============================================
  // TIPOS DE PRODUCCIÓN
  // ============================================
  TIPOS: {
    engorda:           { nombre: "Pollo de engorda",         icon: "🐔", color: "#F59E0B", desc: "Para producción de carne en 35-49 días" },
    ponedora:          { nombre: "Gallina ponedora",          icon: "🥚", color: "#FCD34D", desc: "Postura comercial, huevo blanco o café" },
    reproductora:      { nombre: "Reproductora pesada",       icon: "🐓", color: "#DC2626", desc: "Producción de huevo fértil para incubadora" },
    pavo:              { nombre: "Pavo",                      icon: "🦃", color: "#7C2D12", desc: "Engorde de pavo para carne" },
    doble_proposito:   { nombre: "Doble propósito / Criolla", icon: "🐤", color: "#84CC16", desc: "Razas rústicas, traspatio y autoconsumo" },
    generico:          { nombre: "Genérico (NRC)",            icon: "📘", color: "#64748B", desc: "Requerimientos estándar NRC 1994" }
  },

  // ============================================
  // ETAPAS BASE POR TIPO (con requerimientos NRC)
  // EM en kcal/kg, todos los % en base materia seca
  // ============================================
  ETAPAS_BASE: {

    // ====== ENGORDA ======
    engorda: [
      {
        id: "preiniciador", nombre: "Pre-iniciador", rango: "0-7 días",
        descripcion: "Alta densidad nutricional para arranque. Crítica primera semana.",
        req: { em: 3000, pc: 23.0, lys: 1.42, met: 0.56, metcys: 1.07, thr: 0.95, trp: 0.24, ca: 0.96, p: 0.48, na: 0.20, fc_max: 4.5, ee_min: 3.5 },
        tips: [
          "Densidad nutricional alta es CRÍTICA en los primeros 7 días",
          "Usa proteínas de alta digestibilidad: pasta de soya 48% sobre 44%",
          "Considera incluir 2-3% de harina de pescado",
          "Presentación crombelizada o pellet pequeño es ideal",
          "Aceite mín 1.5% para mejorar palatabilidad y energía"
        ],
        restricciones: { maiz_max: 60, soya48_min: 28, soya44_max: 15, ddgs_max: 4, harpez_max: 5, sebo_max: 2 }
      },
      {
        id: "iniciador", nombre: "Iniciador", rango: "8-14 días",
        descripcion: "Continúa el arranque, ya tolera más volumen pero mantiene densidad.",
        req: { em: 3050, pc: 22.0, lys: 1.32, met: 0.52, metcys: 1.00, thr: 0.88, trp: 0.22, ca: 0.92, p: 0.46, na: 0.18, fc_max: 5.0 },
        tips: [
          "Reduce ligeramente PC sin sacrificar lisina digestible",
          "Es buen momento para introducir DDGS en bajos niveles",
          "Vigila la calidad del pellet: friabilidad alta = pollo no come bien"
        ],
        restricciones: { maiz_max: 62, soya48_min: 25, ddgs_max: 6, harpez_max: 4 }
      },
      {
        id: "crecimiento", nombre: "Crecimiento", rango: "15-28 días",
        descripcion: "Máximo desarrollo muscular. La etapa con mayor consumo total.",
        req: { em: 3150, pc: 20.5, lys: 1.18, met: 0.46, metcys: 0.90, thr: 0.78, trp: 0.20, ca: 0.85, p: 0.42, na: 0.16, fc_max: 5.5 },
        tips: [
          "Etapa con mayor impacto en costo total — optimiza precio aquí",
          "Puedes subir DDGS hasta 8% para reducir costo",
          "Considera enzimas (xilanasa) si usas trigo o salvado",
          "Fitasa permite reducir fosfato monocálcico y bajar costo"
        ],
        restricciones: { maiz_max: 65, ddgs_max: 8, salv_max: 5 }
      },
      {
        id: "finalizador", nombre: "Finalizador", rango: "29-42 días",
        descripcion: "Acabado y deposición de grasa. Eficiencia de conversión clave.",
        req: { em: 3200, pc: 19.0, lys: 1.05, met: 0.42, metcys: 0.82, thr: 0.70, trp: 0.18, ca: 0.80, p: 0.40, na: 0.16, fc_max: 6.0 },
        tips: [
          "Energía alta + proteína moderada = mejor conversión",
          "Aceite/grasa 4-6% mejora ganancia de peso terminal",
          "Reducir PC ahorra costo sin afectar rendimiento de canal",
          "Sube fibra moderadamente (salvado) si hay calor para mejorar tracto"
        ],
        restricciones: { maiz_max: 68, ddgs_max: 10, aceite_min: 2 }
      },
      {
        id: "retiro", nombre: "Retiro", rango: "43+ días",
        descripcion: "Sin coccidiostatos ni promotores. Periodo de eliminación de residuos.",
        req: { em: 3200, pc: 18.5, lys: 1.00, met: 0.40, metcys: 0.78, thr: 0.68, trp: 0.17, ca: 0.78, p: 0.38, na: 0.15 },
        tips: [
          "QUITAR coccidiostatos, ionóforos y promotores de crecimiento",
          "Periodo legal de retiro mínimo de 5 días antes del sacrificio",
          "Mantén nutrición pero simplifica fórmula"
        ],
        restricciones: { maiz_max: 68, ddgs_max: 10 }
      }
    ],

    // ====== PONEDORAS ======
    ponedora: [
      {
        id: "pollita-ini", nombre: "Pollita iniciación", rango: "0-6 semanas",
        descripcion: "Cría de la pollita futura ponedora. Desarrollo de aparato digestivo.",
        req: { em: 2900, pc: 20.0, lys: 1.10, met: 0.45, metcys: 0.83, thr: 0.74, trp: 0.20, ca: 0.95, p: 0.45, na: 0.18, fc_max: 5.0 },
        tips: [
          "Buscar uniformidad del lote — clave para producción futura",
          "Pesos a 6 semanas determinan productividad final",
          "Densidad nutricional moderada — no engordar prematuramente"
        ],
        restricciones: { maiz_max: 60, soya48_min: 22, ddgs_max: 5 }
      },
      {
        id: "pollita-crec", nombre: "Pollita crecimiento", rango: "7-12 semanas",
        descripcion: "Desarrollo esquelético. Etapa de fibra moderada.",
        req: { em: 2850, pc: 18.0, lys: 0.90, met: 0.38, metcys: 0.70, thr: 0.62, trp: 0.18, ca: 0.90, p: 0.40, na: 0.17, fc_max: 6.0 },
        tips: [
          "Aumenta fibra para desarrollar volumen del tracto",
          "Salvado de trigo hasta 8-10% es deseable aquí",
          "No sobrealimentar — pollona gorda = mala ponedora"
        ],
        restricciones: { maiz_max: 60, salv_max: 10, ddgs_max: 8 }
      },
      {
        id: "pollona-des", nombre: "Pollona desarrollo", rango: "13-16 semanas",
        descripcion: "Maduración pre-reproductiva. Prepara hueso medular para postura.",
        req: { em: 2800, pc: 16.0, lys: 0.78, met: 0.34, metcys: 0.62, thr: 0.55, trp: 0.16, ca: 1.10, p: 0.38, na: 0.16, fc_max: 6.5 },
        tips: [
          "Empieza a subir calcio paulatinamente — hueso medular se forma",
          "Cuida peso corporal — pollona pasada de peso = problemas de postura",
          "Si hay estrés calórico, aumenta densidad de aminoácidos"
        ],
        restricciones: { maiz_max: 62, salv_max: 12 }
      },
      {
        id: "prepostura", nombre: "Pre-postura", rango: "17-18 semanas",
        descripcion: "Transición crítica antes del primer huevo. Calcio en aumento.",
        req: { em: 2800, pc: 17.5, lys: 0.85, met: 0.40, metcys: 0.72, thr: 0.62, trp: 0.18, ca: 2.50, p: 0.45, na: 0.18 },
        tips: [
          "CALCIO debe subir a 2.5% para preparar hueso medular",
          "50% del calcio debe ser de partícula gruesa (>2mm)",
          "Vigila inicio de postura — si tarda, ajustar fotoperiodo"
        ],
        restricciones: { maiz_max: 62, carb_min: 3 }
      },
      {
        id: "fase1", nombre: "Postura fase 1 (pico)", rango: "19-40 semanas",
        descripcion: "Pico de producción >90%. Mayor demanda nutricional.",
        req: { em: 2850, pc: 18.0, lys: 0.92, met: 0.45, metcys: 0.78, thr: 0.66, trp: 0.20, ca: 4.20, p: 0.42, na: 0.18, fc_max: 6.0 },
        tips: [
          "Calcio 4.0-4.3% — mitad fina, mitad gruesa para liberación nocturna",
          "Met digestible es el aa limitante en postura",
          "Si la cáscara mejora, sube fitasa para reducir P inorgánico",
          "Vigila pigmentación: marigold + ají si exigen yema roja"
        ],
        restricciones: { maiz_max: 65, carb_min: 7, fosf_max: 1.5 }
      },
      {
        id: "fase2", nombre: "Postura fase 2", rango: "41-60 semanas",
        descripcion: "Producción media. Mantener calidad de cáscara y huevo.",
        req: { em: 2800, pc: 17.0, lys: 0.85, met: 0.42, metcys: 0.74, thr: 0.62, trp: 0.18, ca: 4.30, p: 0.40, na: 0.17 },
        tips: [
          "Calcio sube a 4.3% — la cáscara empieza a degradarse",
          "Reduce PC pero mantén AA digestibles",
          "Aceite vegetal mejora yema y palatabilidad"
        ],
        restricciones: { maiz_max: 65, carb_min: 8 }
      },
      {
        id: "fase3", nombre: "Postura fase 3 (final)", rango: "61+ semanas",
        descripcion: "Producción tardía. Calcio máximo, proteína controlada.",
        req: { em: 2780, pc: 16.0, lys: 0.78, met: 0.40, metcys: 0.70, thr: 0.58, trp: 0.17, ca: 4.50, p: 0.38, na: 0.17 },
        tips: [
          "Ca 4.5% + 2/3 partícula gruesa = mejor cáscara",
          "Considera vitamina D3 25-OH para metabolismo de calcio",
          "Si la cáscara colapsa, evalúa muda forzada o saca al lote"
        ],
        restricciones: { maiz_max: 65, carb_min: 8.5 }
      }
    ],

    // ====== REPRODUCTORAS PESADAS ======
    reproductora: [
      {
        id: "rep-ini", nombre: "Iniciador reproductora", rango: "0-4 semanas",
        descripcion: "Arranque de la reproductora. Desarrollo similar a engorda pero controlado.",
        req: { em: 2900, pc: 19.0, lys: 1.05, met: 0.45, metcys: 0.85, thr: 0.72, trp: 0.20, ca: 0.95, p: 0.45, na: 0.18 },
        tips: [
          "Restricción alimentaria desde semana 2 — controla peso corporal",
          "Uniformidad del lote es CRÍTICA — pesa semanal",
          "Pico iniciador de 7 días, después transición rápida a crecimiento"
        ],
        restricciones: { maiz_max: 60, ddgs_max: 5 }
      },
      {
        id: "rep-crec", nombre: "Crecimiento reproductora", rango: "5-15 semanas",
        descripcion: "Restricción alimentaria controlada para no acumular grasa.",
        req: { em: 2750, pc: 15.5, lys: 0.78, met: 0.34, metcys: 0.65, thr: 0.55, trp: 0.16, ca: 0.90, p: 0.40, na: 0.16, fc_max: 7.0 },
        tips: [
          "Aumenta fibra deliberadamente — controla saciedad",
          "Avena, salvado, alfalfa son útiles aquí",
          "Pesa el lote semanalmente, ajusta consumo según peso real"
        ],
        restricciones: { maiz_max: 55, salv_max: 12, alfa_max: 5 }
      },
      {
        id: "rep-des", nombre: "Desarrollo reproductora", rango: "16-22 semanas",
        descripcion: "Pre-reproductivo. Calcio y proteína suben gradualmente.",
        req: { em: 2750, pc: 16.0, lys: 0.82, met: 0.36, metcys: 0.68, thr: 0.58, trp: 0.17, ca: 1.20, p: 0.42, na: 0.17 },
        tips: [
          "Calcio sube a 1.2% — formación de hueso medular",
          "No estimular fotoperiodo aún",
          "Macho y hembra tienen requerimientos distintos en esta etapa"
        ],
        restricciones: { maiz_max: 60 }
      },
      {
        id: "rep-prepost", nombre: "Pre-postura reproductora", rango: "23-25 semanas",
        descripcion: "Estimulación lumínica. Calcio crítico antes del primer huevo.",
        req: { em: 2800, pc: 17.0, lys: 0.85, met: 0.40, metcys: 0.72, thr: 0.62, trp: 0.18, ca: 2.50, p: 0.45, na: 0.18 },
        tips: [
          "Calcio salta a 2.5% — preparación medular crítica",
          "Inicia fotoperiodo creciente (15-30 min/sem)",
          "Macho: vigilar peso vs hembra para apareamiento óptimo"
        ],
        restricciones: { carb_min: 4 }
      },
      {
        id: "rep-pico", nombre: "Postura reproductora — pico", rango: "26-40 semanas",
        descripcion: "Pico de producción de huevo fértil.",
        req: { em: 2850, pc: 16.5, lys: 0.85, met: 0.42, metcys: 0.74, thr: 0.62, trp: 0.18, ca: 3.00, p: 0.42, na: 0.18 },
        tips: [
          "Vitamina E + selenio extra para fertilidad",
          "Ácidos grasos omega-3 (aceite pescado o linaza) mejoran nacimiento",
          "Calcio moderado vs ponedora comercial — la fertilidad importa"
        ],
        restricciones: { maiz_max: 62, carb_min: 5, harpez_max: 3 }
      },
      {
        id: "rep-media", nombre: "Postura reproductora — media", rango: "41-55 semanas",
        descripcion: "Mantenimiento de producción y fertilidad.",
        req: { em: 2820, pc: 15.5, lys: 0.78, met: 0.40, metcys: 0.70, thr: 0.58, trp: 0.17, ca: 3.20, p: 0.40, na: 0.17 },
        tips: [
          "Mantener PC moderado para evitar deterioro de fertilidad",
          "Vit E sigue siendo crítica",
          "Vigilar peso de macho — sobrepeso reduce fertilidad"
        ],
        restricciones: { maiz_max: 62, carb_min: 6 }
      },
      {
        id: "rep-final", nombre: "Postura reproductora — final", rango: "56+ semanas",
        descripcion: "Postura final. Calcio máximo, AA controlado.",
        req: { em: 2800, pc: 14.5, lys: 0.72, met: 0.38, metcys: 0.66, thr: 0.55, trp: 0.16, ca: 3.40, p: 0.38, na: 0.17 },
        tips: [
          "Calcio 3.4% — la cáscara y fertilidad caen juntas",
          "Considera saca del lote si fertilidad <80%"
        ],
        restricciones: { maiz_max: 62, carb_min: 6.5 }
      }
    ],

    // ====== PAVOS ======
    pavo: [
      {
        id: "pavo-preini", nombre: "Pre-iniciador pavo", rango: "0-3 semanas",
        descripcion: "Densidad muy alta. Pavo es más exigente que pollo.",
        req: { em: 2850, pc: 28.0, lys: 1.65, met: 0.62, metcys: 1.10, thr: 1.00, trp: 0.27, ca: 1.30, p: 0.65, na: 0.20 },
        tips: [
          "Pavo demanda PC >27% — sin esto no arranca bien",
          "Harina de pescado 4-5% es casi obligatoria aquí",
          "Vitamina A y E altas — sistema inmune lento",
          "Texturas: triturado fino o crumb"
        ],
        restricciones: { maiz_max: 50, soya48_min: 35, harpez_min: 3, harpez_max: 5 }
      },
      {
        id: "pavo-ini", nombre: "Iniciador pavo", rango: "4-6 semanas",
        descripcion: "Continúa con alta proteína, bajando ligeramente.",
        req: { em: 2900, pc: 26.0, lys: 1.55, met: 0.58, metcys: 1.05, thr: 0.92, trp: 0.25, ca: 1.20, p: 0.60, na: 0.20 },
        tips: [
          "Mantén alta calidad de proteína",
          "DDGS no recomendado en pavo joven",
          "Suelen aparecer problemas de patas — vit D3 + Mn críticos"
        ],
        restricciones: { maiz_max: 52, ddgs_max: 3 }
      },
      {
        id: "pavo-crec", nombre: "Crecimiento pavo", rango: "7-12 semanas",
        descripcion: "Desarrollo esquelético y muscular intenso.",
        req: { em: 3000, pc: 22.0, lys: 1.30, met: 0.50, metcys: 0.92, thr: 0.78, trp: 0.22, ca: 1.10, p: 0.55, na: 0.18 },
        tips: [
          "Mantén lisina alta para músculo de pechuga",
          "Aceite 4-5% para densidad energética",
          "Empezar a moderar PC a 22%"
        ],
        restricciones: { maiz_max: 58, ddgs_max: 6 }
      },
      {
        id: "pavo-des", nombre: "Desarrollo pavo", rango: "13-16 semanas",
        descripcion: "Continúa formación corporal.",
        req: { em: 3050, pc: 19.0, lys: 1.15, met: 0.45, metcys: 0.82, thr: 0.68, trp: 0.20, ca: 1.00, p: 0.50, na: 0.17 },
        tips: [
          "Reduces PC pero mantienes lisina digestible",
          "Mantén buen perfil de aminoácidos",
          "Considera enzimas si subes inclusión de DDGS"
        ],
        restricciones: { maiz_max: 60, ddgs_max: 8 }
      },
      {
        id: "pavo-fin", nombre: "Finalizador pavo", rango: "17-19 semanas",
        descripcion: "Acabado. Energía sube, PC baja.",
        req: { em: 3100, pc: 17.0, lys: 1.00, met: 0.42, metcys: 0.74, thr: 0.62, trp: 0.18, ca: 0.95, p: 0.48, na: 0.16 },
        tips: [
          "Aceite 5-6% para máxima conversión",
          "PC moderada — la pechuga ya está formada",
          "Vigilar contenido de pigmentos si mercado lo exige"
        ],
        restricciones: { maiz_max: 62, aceite_min: 4 }
      },
      {
        id: "pavo-acab", nombre: "Acabado pavo", rango: "20+ semanas",
        descripcion: "Hembras se sacrifican aquí. Machos siguen 2-4 sem más.",
        req: { em: 3150, pc: 15.5, lys: 0.92, met: 0.40, metcys: 0.70, thr: 0.58, trp: 0.17, ca: 0.90, p: 0.45, na: 0.16 },
        tips: [
          "Retiro de aditivos al menos 5 días antes",
          "Énfasis en eficiencia de conversión final"
        ],
        restricciones: { maiz_max: 65 }
      }
    ],

    // ====== DOBLE PROPÓSITO / CRIOLLAS ======
    doble_proposito: [
      {
        id: "dp-ini", nombre: "Iniciador", rango: "0-6 semanas",
        descripcion: "Arranque de raza rústica. Tolera fórmulas más simples.",
        req: { em: 2800, pc: 18.0, lys: 1.00, met: 0.40, metcys: 0.75, thr: 0.68, trp: 0.20, ca: 0.95, p: 0.45, na: 0.17, fc_max: 6.0 },
        tips: [
          "Razas rústicas toleran fórmulas más económicas",
          "Salvado y maíz quebrado funcionan bien",
          "No requiere densidad alta como Cobb/Ross",
          "Es el segmento más sensible al precio del alimento"
        ],
        restricciones: { maiz_max: 65, salv_max: 8 }
      },
      {
        id: "dp-crec", nombre: "Crecimiento", rango: "7-16 semanas",
        descripcion: "Desarrollo lento característico de criollas.",
        req: { em: 2750, pc: 15.0, lys: 0.78, met: 0.32, metcys: 0.62, thr: 0.55, trp: 0.16, ca: 0.85, p: 0.40, na: 0.16, fc_max: 7.0 },
        tips: [
          "Permite mayor inclusión de subproductos locales",
          "Maíz molido grueso, no requiere pellet",
          "Suplementos con sobras de cocina están bien en traspatio"
        ],
        restricciones: { maiz_max: 70, salv_max: 12 }
      },
      {
        id: "dp-post", nombre: "Postura / Mantenimiento", rango: "17-65 semanas",
        descripcion: "Postura moderada (180-220 huevos/año). Mantenimiento básico.",
        req: { em: 2750, pc: 16.0, lys: 0.78, met: 0.38, metcys: 0.68, thr: 0.55, trp: 0.17, ca: 3.50, p: 0.38, na: 0.17 },
        tips: [
          "Calcio menor que ponedora comercial — postura más baja",
          "Acceso a pasto mejora pigmentación natural de yema",
          "Insectos y desperdicios son aporte nutricional valioso"
        ],
        restricciones: { maiz_max: 70, carb_min: 6 }
      },
      {
        id: "dp-mant", nombre: "Mantenimiento adulto", rango: "66+ semanas",
        descripcion: "Mantenimiento de aves rústicas longevas.",
        req: { em: 2700, pc: 14.0, lys: 0.65, met: 0.32, metcys: 0.58, thr: 0.48, trp: 0.15, ca: 3.20, p: 0.36, na: 0.16 },
        tips: [
          "Fórmula económica de mantenimiento",
          "Suplementación con verde y sobras es ideal"
        ],
        restricciones: { maiz_max: 70 }
      }
    ],

    // ====== GENÉRICO NRC ======
    generico: [
      {
        id: "nrc-ini", nombre: "Iniciador NRC", rango: "0-21 días",
        descripcion: "Requerimiento estándar NRC 1994.",
        req: { em: 3000, pc: 23.0, lys: 1.20, met: 0.50, metcys: 0.93, thr: 0.83, trp: 0.20, ca: 1.00, p: 0.45, na: 0.20 },
        tips: ["Estándar NRC 1994 — útil cuando no se conoce raza específica"],
        restricciones: { maiz_max: 65, soya48_min: 25 }
      },
      {
        id: "nrc-crec", nombre: "Crecimiento NRC", rango: "22-42 días",
        descripcion: "Estándar NRC para crecimiento.",
        req: { em: 3100, pc: 20.0, lys: 1.00, met: 0.38, metcys: 0.72, thr: 0.74, trp: 0.18, ca: 0.90, p: 0.40, na: 0.15 },
        tips: ["Estándar NRC 1994"],
        restricciones: { maiz_max: 68 }
      },
      {
        id: "nrc-fin", nombre: "Finalizador NRC", rango: "43+ días",
        descripcion: "Estándar NRC para finalizador.",
        req: { em: 3200, pc: 18.0, lys: 0.85, met: 0.32, metcys: 0.60, thr: 0.68, trp: 0.16, ca: 0.80, p: 0.35, na: 0.12 },
        tips: ["Estándar NRC 1994"],
        restricciones: { maiz_max: 70 }
      }
    ]

  },

  // ============================================
  // RAZAS ESPECÍFICAS (con overrides menores)
  // Cada raza usa la base de su tipo + ajustes
  // ============================================
  RAZAS: [

    // ===== ENGORDA =====
    {
      id: "ross308", nombre: "Ross 308", tipo: "engorda",
      pais: "Aviagen", descripcion: "La raza más popular en México. Excelente uniformidad y conversión.",
      mercado: "Engorde estándar 35-42 días, mercado integrado",
      ventajas: ["Excelente conversión 1.55-1.65", "Alta uniformidad", "Buena calidad de pechuga"],
      overrides: {} // usa base
    },
    {
      id: "cobb500", nombre: "Cobb 500", tipo: "engorda",
      pais: "Cobb-Vantress", descripcion: "Raza muy popular en México. Excelente rendimiento de canal.",
      mercado: "Engorde estándar 38-42 días",
      ventajas: ["Excelente rendimiento de carne", "Alta robustez", "Costo competitivo"],
      overrides: {
        preiniciador: { em: 3025, pc: 23.5, lys: 1.45 },
        finalizador: { em: 3175, pc: 19.5, lys: 1.10 }
      }
    },
    {
      id: "cobb700", nombre: "Cobb 700", tipo: "engorda",
      pais: "Cobb-Vantress", descripcion: "Variante pesada para mercado de pollo entero / pieza grande.",
      mercado: "Pollo entero pesado, 49-56 días",
      ventajas: ["Mayor peso corporal", "Mejor rendimiento de pechuga", "Para mercados premium"],
      overrides: {
        crecimiento: { em: 3175, pc: 21.0 },
        finalizador: { em: 3225, pc: 19.5, lys: 1.08 }
      }
    },
    {
      id: "ross708", nombre: "Ross 708", tipo: "engorda",
      pais: "Aviagen", descripcion: "Raza pesada de Aviagen, alto rendimiento de pechuga.",
      mercado: "Pollo de pechuga premium, 49+ días",
      ventajas: ["Máximo rendimiento de pechuga", "Crecimiento sostenido", "Mercados de alto valor"],
      overrides: {
        finalizador: { em: 3220, pc: 19.5 }
      }
    },
    {
      id: "hubbard-classic", nombre: "Hubbard Classic", tipo: "engorda",
      pais: "Hubbard ISA", descripcion: "Raza alternativa de buena adaptación a climas cálidos mexicanos.",
      mercado: "Mercado tradicional, climas cálidos",
      ventajas: ["Tolerancia al calor", "Robustez", "Buena pigmentación"],
      overrides: {
        preiniciador: { em: 2980, pc: 22.5 }
      }
    },
    {
      id: "hubbard-flex", nombre: "Hubbard Flex", tipo: "engorda",
      pais: "Hubbard ISA", descripcion: "Versatilidad para diferentes pesos de mercado.",
      mercado: "Flexibilidad 35-49 días",
      ventajas: ["Flexible en peso de sacrificio", "Buena conversión sostenida"],
      overrides: {}
    },
    {
      id: "arbor-acres", nombre: "Arbor Acres Plus", tipo: "engorda",
      pais: "Aviagen", descripcion: "Línea histórica con buenos resultados en México.",
      mercado: "Engorde estándar",
      ventajas: ["Probada en México", "Buen costo de pollito"],
      overrides: {}
    },
    {
      id: "hybro-pg", nombre: "Hybro PG+", tipo: "engorda",
      pais: "Hendrix Genetics", descripcion: "Alternativa europea con presencia creciente.",
      mercado: "Engorde estándar",
      ventajas: ["Buena viabilidad", "Bajo costo de mantenimiento"],
      overrides: {}
    },

    // ===== PONEDORAS =====
    {
      id: "hyline-w36", nombre: "Hy-Line W-36", tipo: "ponedora",
      pais: "Hy-Line International", descripcion: "Ponedora blanca #1 en México. Huevo blanco mediano-grande.",
      mercado: "Huevo blanco comercial — la más popular",
      ventajas: ["Persistencia 90+ semanas", "Huevo de cáscara fuerte", "Bajo consumo"],
      overrides: {
        fase1: { em: 2900, pc: 18.5, lys: 0.93, ca: 4.30 }
      }
    },
    {
      id: "hyline-w80", nombre: "Hy-Line W-80", tipo: "ponedora",
      pais: "Hy-Line International", descripcion: "Generación nueva, mayor tamaño de huevo.",
      mercado: "Huevo blanco grande/extra grande",
      ventajas: ["Huevo más grande", "Excelente persistencia"],
      overrides: {
        fase1: { em: 2880, pc: 18.5, lys: 0.95, ca: 4.30 }
      }
    },
    {
      id: "hyline-brown", nombre: "Hy-Line Brown", tipo: "ponedora",
      pais: "Hy-Line International", descripcion: "Ponedora café con altísima persistencia.",
      mercado: "Huevo café comercial",
      ventajas: ["Persistencia >100 semanas", "Huevo café grande"],
      overrides: {
        fase1: { em: 2850, pc: 18.0, lys: 0.92, ca: 4.20 }
      }
    },
    {
      id: "lohmann-lsl", nombre: "Lohmann LSL-Lite", tipo: "ponedora",
      pais: "Lohmann Tierzucht", descripcion: "Blanca europea muy eficiente.",
      mercado: "Huevo blanco comercial",
      ventajas: ["Excelente eficiencia alimenticia", "Buena persistencia"],
      overrides: {}
    },
    {
      id: "lohmann-brown", nombre: "Lohmann Brown Classic", tipo: "ponedora",
      pais: "Lohmann Tierzucht", descripcion: "Café muy popular en México.",
      mercado: "Huevo café comercial",
      ventajas: ["Robustez", "Buena cáscara", "Carácter dócil"],
      overrides: {
        fase1: { em: 2850, pc: 17.5, lys: 0.88 }
      }
    },
    {
      id: "isa-brown", nombre: "ISA Brown", tipo: "ponedora",
      pais: "Hendrix Genetics", descripcion: "Café estándar con presencia mundial.",
      mercado: "Huevo café comercial",
      ventajas: ["Confiabilidad probada", "Adaptabilidad"],
      overrides: {}
    },
    {
      id: "bovans-white", nombre: "Bovans White", tipo: "ponedora",
      pais: "Hendrix Genetics", descripcion: "Blanca con cáscara muy fuerte.",
      mercado: "Huevo blanco — fortaleza de cáscara",
      ventajas: ["Cáscara excepcional", "Persistencia"],
      overrides: {}
    },
    {
      id: "bovans-brown", nombre: "Bovans Brown", tipo: "ponedora",
      pais: "Hendrix Genetics", descripcion: "Café con buena conversión.",
      mercado: "Huevo café comercial",
      ventajas: ["Conversión eficiente", "Tamaño de huevo uniforme"],
      overrides: {}
    },
    {
      id: "dekalb-white", nombre: "Dekalb White", tipo: "ponedora",
      pais: "Hendrix Genetics", descripcion: "Blanca histórica, presencia tradicional en México.",
      mercado: "Huevo blanco comercial",
      ventajas: ["Adaptada a climas mexicanos", "Buena rusticidad"],
      overrides: {}
    },
    {
      id: "babcock-380", nombre: "Babcock B-380", tipo: "ponedora",
      pais: "Hendrix Genetics", descripcion: "Café especializada en cáscara fuerte.",
      mercado: "Huevo café — cáscara reforzada",
      ventajas: ["Mejor cáscara del mercado café", "Persistencia"],
      overrides: {}
    },

    // ===== REPRODUCTORAS =====
    {
      id: "cobb500-ap", nombre: "Cobb 500 AP", tipo: "reproductora",
      pais: "Cobb-Vantress", descripcion: "Reproductora pesada para producir Cobb 500.",
      mercado: "Producción de huevo fértil — pollo Cobb",
      ventajas: ["Alta fertilidad", "Persistencia"],
      overrides: {}
    },
    {
      id: "ross308-ap", nombre: "Ross 308 AP", tipo: "reproductora",
      pais: "Aviagen", descripcion: "Reproductora pesada Aviagen.",
      mercado: "Producción de huevo fértil — pollo Ross",
      ventajas: ["Excelente fertilidad", "Uniformidad"],
      overrides: {}
    },
    {
      id: "ross708-ap", nombre: "Ross 708 AP", tipo: "reproductora",
      pais: "Aviagen", descripcion: "Reproductora pesada Ross 708.",
      mercado: "Producción de Ross 708",
      ventajas: ["Alta fertilidad", "Genética premium"],
      overrides: {}
    },
    {
      id: "hubbard-rep", nombre: "Hubbard Reproductora (M77 / JA)", tipo: "reproductora",
      pais: "Hubbard ISA", descripcion: "Reproductora alternativa con buen comportamiento maternal.",
      mercado: "Producción de Hubbard",
      ventajas: ["Robustez", "Tolerancia ambiental"],
      overrides: {}
    },

    // ===== PAVOS =====
    {
      id: "nicholas-select", nombre: "Nicholas Select", tipo: "pavo",
      pais: "Aviagen Turkeys", descripcion: "El pavo más usado en México industrial.",
      mercado: "Pavo de pechuga, 16-22 semanas",
      ventajas: ["Rendimiento de pechuga superior", "Eficiencia probada"],
      overrides: {}
    },
    {
      id: "hybrid-converter", nombre: "Hybrid Converter", tipo: "pavo",
      pais: "Hendrix Genetics", descripcion: "Pavo con excelente conversión alimenticia.",
      mercado: "Conversión eficiente, 18-20 semanas",
      ventajas: ["Excelente conversión", "Robustez"],
      overrides: {}
    },
    {
      id: "but-6", nombre: "B.U.T. 6", tipo: "pavo",
      pais: "Aviagen Turkeys", descripcion: "Línea británica para mercados premium.",
      mercado: "Pavo entero o pesado",
      ventajas: ["Calidad de canal", "Buen rendimiento"],
      overrides: {}
    },

    // ===== DOBLE PROPÓSITO / CRIOLLAS =====
    {
      id: "plymouth-rock", nombre: "Plymouth Rock Barred", tipo: "doble_proposito",
      pais: "EUA (histórica)", descripcion: "Raza histórica, doble propósito clásica.",
      mercado: "Traspatio, autoconsumo, mercado local",
      ventajas: ["Rusticidad", "Buena postura (200 huevos/año)", "Carne sabrosa"],
      overrides: {}
    },
    {
      id: "rhode-island", nombre: "Rhode Island Red", tipo: "doble_proposito",
      pais: "EUA (histórica)", descripcion: "Una de las criollas más extendidas en México rural.",
      mercado: "Traspatio, mercado rural",
      ventajas: ["Excelente postura para criolla (220 huevos/año)", "Robustez", "Carne firme"],
      overrides: {}
    },
    {
      id: "sussex", nombre: "Sussex (Light/Speckled)", tipo: "doble_proposito",
      pais: "Reino Unido (histórica)", descripcion: "Doble propósito británica con buena postura.",
      mercado: "Traspatio especializado",
      ventajas: ["Buena postura", "Carne de calidad", "Fácil manejo"],
      overrides: {}
    },
    {
      id: "leghorn", nombre: "Leghorn (Blanca)", tipo: "doble_proposito",
      pais: "Italia (histórica)", descripcion: "Ponedora blanca rústica — abuela genética de muchas razas comerciales.",
      mercado: "Postura en traspatio, huevo blanco",
      ventajas: ["Postura prolífica (250+ huevos)", "Bajo consumo", "Ágil"],
      overrides: {}
    },
    {
      id: "criollo-mx", nombre: "Pollo Criollo Mexicano", tipo: "doble_proposito",
      pais: "México (raza nativa)", descripcion: "Aves criollas mexicanas: Cuello desnudo, Indio, Bolio, etc.",
      mercado: "Traspatio rural, mercado de consomé y caldo",
      ventajas: ["Máxima rusticidad", "Adaptación local total", "Carne tradicional valorada"],
      overrides: {}
    },

    // ===== GENÉRICO =====
    {
      id: "generico-nrc", nombre: "Genérico NRC 1994", tipo: "generico",
      pais: "USA (referencia académica)", descripcion: "Requerimientos estándar de NRC para investigación o cuando se desconoce la raza.",
      mercado: "Referencia técnica universal",
      ventajas: ["Estándar académico", "Universalmente aceptado"],
      overrides: {}
    }
  ],

  // ============================================
  // HELPERS
  // ============================================

  getRazasPorTipo(tipo) {
    return this.RAZAS.filter(r => r.tipo === tipo);
  },

  getRaza(razaId) {
    return this.RAZAS.find(r => r.id === razaId);
  },

  getEtapas(razaId) {
    const raza = this.getRaza(razaId);
    if (!raza) return [];
    return this.ETAPAS_BASE[raza.tipo] || [];
  },

  getEtapa(razaId, etapaId) {
    const etapas = this.getEtapas(razaId);
    return etapas.find(e => e.id === etapaId);
  },

  getRequerimientos(razaId, etapaId) {
    const raza = this.getRaza(razaId);
    const etapa = this.getEtapa(razaId, etapaId);
    if (!raza || !etapa) return null;
    const base = { ...etapa.req };
    const override = (raza.overrides || {})[etapaId] || {};
    return { ...base, ...override };
  },

  getTips(razaId, etapaId) {
    const etapa = this.getEtapa(razaId, etapaId);
    return etapa ? etapa.tips || [] : [];
  },

  getRestricciones(razaId, etapaId) {
    const etapa = this.getEtapa(razaId, etapaId);
    return etapa ? etapa.restricciones || {} : {};
  },

  // ============================================
  // SUGERENCIAS INTELIGENTES (validaciones contextuales)
  // ============================================

  generarSugerencias(razaId, etapaId, ingredientesActivos, formula) {
    const sugerencias = [];
    const raza = this.getRaza(razaId);
    const etapa = this.getEtapa(razaId, etapaId);
    if (!raza || !etapa) return sugerencias;

    const req = this.getRequerimientos(razaId, etapaId);
    const restr = this.getRestricciones(razaId, etapaId);

    // 1. Validación de presencia de ingredientes clave
    const tieneAceite = ingredientesActivos.some(i => /aceite|sebo/i.test(i.name));
    const tieneCalcio = ingredientesActivos.some(i => /carbonato|calcio/i.test(i.name));
    const tieneFosforo = ingredientesActivos.some(i => /fosfato/i.test(i.name));
    const tieneSal = ingredientesActivos.some(i => /sal/i.test(i.name));
    const tienePremezcla = ingredientesActivos.some(i => /premezcla|premix/i.test(i.name));
    const tieneAA = ingredientesActivos.some(i => /metionina|lisina|treonina/i.test(i.name));

    if (!tieneCalcio) sugerencias.push({ tipo: "danger", icon: "⚠️", msg: "Falta fuente de calcio (carbonato). Tu fórmula no será viable." });
    if (!tieneFosforo) sugerencias.push({ tipo: "danger", icon: "⚠️", msg: "Falta fuente de fósforo disponible (fosfato monocálcico/bicálcico)." });
    if (!tieneSal) sugerencias.push({ tipo: "warning", icon: "⚠️", msg: "Falta sal común — el sodio es esencial para metabolismo." });
    if (!tienePremezcla) sugerencias.push({ tipo: "warning", icon: "💊", msg: "Falta premezcla vit/min. Sin esto el ave no recibe vitaminas críticas." });
    if (!tieneAceite && req.em > 3000) sugerencias.push({ tipo: "info", icon: "🛢️", msg: `Para alcanzar ${req.em} kcal necesitarás aceite o grasa (3-6%).` });
    if (!tieneAA && etapa.id.includes("ini")) sugerencias.push({ tipo: "info", icon: "💉", msg: "En etapas iniciales, DL-Metionina y L-Lisina HCl son casi obligatorios para alcanzar AA digestibles." });

    // 2. Sugerencias específicas por etapa
    const ddgs = ingredientesActivos.find(i => /ddgs/i.test(i.name));
    if (ddgs && (etapa.id === "preiniciador" || etapa.id === "iniciador" || etapa.id === "pavo-preini")) {
      sugerencias.push({ tipo: "warning", icon: "⚠️", msg: "DDGS no es ideal en pre-iniciador — limita a <4% por baja digestibilidad." });
    }

    if (etapa.id.startsWith("fase") || etapa.id.includes("post")) {
      const carb = ingredientesActivos.find(i => /carbonato/i.test(i.name));
      if (carb) sugerencias.push({ tipo: "info", icon: "🥚", msg: "En postura, 50% del carbonato debe ser partícula gruesa (>2mm) para liberación nocturna." });
    }

    if (raza.tipo === "pavo") {
      sugerencias.push({ tipo: "info", icon: "🦃", msg: "Pavo requiere Met digestible alta — considera DL-Met al 0.3-0.5%." });
    }

    if (raza.tipo === "doble_proposito") {
      sugerencias.push({ tipo: "info", icon: "🌽", msg: "Razas criollas toleran fórmulas más simples — puedes priorizar costo." });
    }

    // 3. Sugerencias de aditivos según contexto
    const fitasa = ingredientesActivos.find(i => /fitasa/i.test(i.name));
    if (!fitasa && tieneFosforo) {
      const fosfato = ingredientesActivos.find(i => /fosfato/i.test(i.name));
      if (fosfato && fosfato.precio > 18) {
        sugerencias.push({ tipo: "tip", icon: "💡", msg: "Con fitasa puedes reducir 0.1-0.15% de fosfato y bajar costo. ¿Activarla?" });
      }
    }

    // 4. Análisis de balance (si ya hay fórmula calculada)
    if (formula && formula.length > 0) {
      let totalEM = 0, totalPC = 0, totalCa = 0;
      formula.forEach(f => {
        const ing = ingredientesActivos.find(i => i.id === f.id);
        if (ing) {
          totalEM += (f.pct / 100) * (ing.em || 0);
          totalPC += (f.pct / 100) * (ing.pc || 0);
          totalCa += (f.pct / 100) * (ing.ca || 0);
        }
      });

      if (totalEM < req.em - 50) sugerencias.push({ tipo: "warning", icon: "🔋", msg: `EM resultante (${Math.round(totalEM)}) está por debajo del requerido (${req.em}). Sube aceite.` });
      if (totalPC < req.pc - 0.5) sugerencias.push({ tipo: "warning", icon: "🥩", msg: `PC resultante (${totalPC.toFixed(1)}%) está por debajo del requerido (${req.pc}%). Sube pasta de soya.` });

      const ratio = totalEM / (totalPC * 1000); // kcal/g de PC
      if (ratio > 0.18 && (etapa.id === "iniciador" || etapa.id === "preiniciador")) {
        sugerencias.push({ tipo: "tip", icon: "⚖️", msg: "Relación EM:PC alta para etapa inicial — podría afectar deposición muscular." });
      }
    }

    return sugerencias;
  }
};
