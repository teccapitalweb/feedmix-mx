// ============================================
// FeedMix MX — Catálogo de Núcleos
// Núcleos premezclados disponibles en mercado mexicano
// ============================================

window.FM_NUCLEOS = {

  // ============================================
  // CATÁLOGO PRINCIPAL DE NÚCLEOS
  // ============================================
  CATALOGO: [

    // ============ GENÉRICOS POR INCLUSIÓN ============
    {
      id: "gen-1pct-engorda",
      nombre: "Núcleo Genérico 1% — Engorda",
      marca: "Genérico",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador"],
      inclusion: 1.0, // % en la fórmula
      precio: 65.00, // MXN/kg
      descripcion: "Núcleo concentrado al 1% — solo vitaminas, minerales traza y aditivos básicos. Requiere agregar Ca, P y AA por separado.",
      aportes: {
        em: 0, pc: 0, ca: 0, p: 0, lys: 0, met: 0, na: 0
      },
      aditivos: ["Vitaminas A,D,E,K,B-complex", "Minerales traza (Cu, Zn, Mn, Fe, I, Se)", "Antioxidante"],
      requiere_extras: ["calcio", "fosforo", "metionina", "lisina", "sal"]
    },
    {
      id: "gen-25pct-engorda-ini",
      nombre: "Núcleo Genérico 2.5% — Iniciador engorda",
      marca: "Genérico",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador"],
      inclusion: 2.5,
      precio: 38.00,
      descripcion: "Núcleo balanceado al 2.5% — incluye vitaminas, minerales, AA sintéticos básicos y coccidiostato. Solo agrega maíz, soya y Ca/P.",
      aportes: {
        em: 0, pc: 18.0, ca: 22.0, p: 12.0, lys: 6.5, met: 4.2, na: 4.5
      },
      aditivos: ["Vitaminas completas", "Minerales traza", "DL-Met", "L-Lys", "Coccidiostato", "Premezcla enzimática"],
      requiere_extras: ["calcio adicional opcional"]
    },
    {
      id: "gen-25pct-engorda-fin",
      nombre: "Núcleo Genérico 2.5% — Finalizador engorda",
      marca: "Genérico",
      tipo: "engorda",
      etapas: ["crecimiento", "finalizador"],
      inclusion: 2.5,
      precio: 36.00,
      descripcion: "Núcleo balanceado al 2.5% para crecimiento/finalizador — densidad nutricional moderada.",
      aportes: {
        em: 0, pc: 16.0, ca: 20.0, p: 11.0, lys: 5.5, met: 3.8, na: 4.0
      },
      aditivos: ["Vitaminas", "Minerales traza", "DL-Met", "Coccidiostato"],
      requiere_extras: []
    },
    {
      id: "gen-5pct-engorda",
      nombre: "Núcleo Genérico 5% — Engorda completa",
      marca: "Genérico",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador", "retiro"],
      inclusion: 5.0,
      precio: 28.00,
      descripcion: "Núcleo al 5% que sustituye toda la fracción proteica/mineral/vitamínica. Solo necesitas agregar maíz y un poco de soya.",
      aportes: {
        em: 1500, pc: 28.0, ca: 18.0, p: 10.0, lys: 4.5, met: 3.0, na: 3.5
      },
      aditivos: ["Pasta soya parcial", "Vitaminas", "Minerales", "AA", "Coccidiostato"],
      requiere_extras: []
    },

    // PONEDORAS
    {
      id: "gen-25pct-postura",
      nombre: "Núcleo Genérico 2.5% — Postura fase 1",
      marca: "Genérico",
      tipo: "ponedora",
      etapas: ["fase1", "fase2"],
      inclusion: 2.5,
      precio: 32.00,
      descripcion: "Núcleo para gallina ponedora pico de producción. Incluye carbonato fino + grueso para cáscara.",
      aportes: {
        em: 0, pc: 8.0, ca: 90.0, p: 6.0, lys: 2.5, met: 2.0, na: 4.0
      },
      aditivos: ["Vitaminas", "Carbonato calcio (fino + grueso)", "DL-Met", "Pigmento amarillo"],
      requiere_extras: []
    },
    {
      id: "gen-5pct-postura",
      nombre: "Núcleo Genérico 5% — Postura completa",
      marca: "Genérico",
      tipo: "ponedora",
      etapas: ["fase1", "fase2", "fase3"],
      inclusion: 5.0,
      precio: 26.00,
      descripcion: "Núcleo al 5% para postura. Incluye proteína parcial, calcio, vitaminas y pigmento.",
      aportes: {
        em: 1200, pc: 22.0, ca: 70.0, p: 11.0, lys: 4.0, met: 3.2, na: 3.5
      },
      aditivos: ["Pasta soya parcial", "Carbonato", "Vitaminas", "Pigmentos"],
      requiere_extras: []
    },
    {
      id: "gen-25pct-pollita",
      nombre: "Núcleo Genérico 2.5% — Pollita iniciación",
      marca: "Genérico",
      tipo: "ponedora",
      etapas: ["pollita-ini", "pollita-crec"],
      inclusion: 2.5,
      precio: 36.00,
      descripcion: "Núcleo para pollita de reemplazo en crianza. Densidad moderada.",
      aportes: {
        em: 0, pc: 16.0, ca: 24.0, p: 13.0, lys: 5.8, met: 3.8, na: 4.5
      },
      aditivos: ["Vitaminas", "Minerales", "DL-Met", "Coccidiostato"],
      requiere_extras: []
    },

    // REPRODUCTORAS
    {
      id: "gen-25pct-reproductora",
      nombre: "Núcleo Genérico 2.5% — Reproductora postura",
      marca: "Genérico",
      tipo: "reproductora",
      etapas: ["rep-pico", "rep-media", "rep-final"],
      inclusion: 2.5,
      precio: 42.00,
      descripcion: "Núcleo para reproductora pesada en postura. Vitamina E + Se elevados para fertilidad.",
      aportes: {
        em: 0, pc: 14.0, ca: 80.0, p: 13.0, lys: 4.5, met: 3.2, na: 4.0
      },
      aditivos: ["Vit E alta", "Selenio orgánico", "Carbonato", "Pigmentos", "Omega-3"],
      requiere_extras: []
    },

    // PAVOS
    {
      id: "gen-25pct-pavo-ini",
      nombre: "Núcleo Genérico 2.5% — Pavo iniciador",
      marca: "Genérico",
      tipo: "pavo",
      etapas: ["pavo-preini", "pavo-ini"],
      inclusion: 2.5,
      precio: 48.00,
      descripcion: "Núcleo concentrado para pavo joven — alta densidad de aminoácidos.",
      aportes: {
        em: 0, pc: 22.0, ca: 26.0, p: 14.0, lys: 8.5, met: 5.5, na: 4.5
      },
      aditivos: ["Vitaminas A,D,E altas", "Mn elevado", "DL-Met", "L-Lys", "Coccidiostato"],
      requiere_extras: []
    },
    {
      id: "gen-25pct-pavo-fin",
      nombre: "Núcleo Genérico 2.5% — Pavo finalizador",
      marca: "Genérico",
      tipo: "pavo",
      etapas: ["pavo-crec", "pavo-des", "pavo-fin", "pavo-acab"],
      inclusion: 2.5,
      precio: 38.00,
      descripcion: "Núcleo para pavo en crecimiento y finalización.",
      aportes: {
        em: 0, pc: 18.0, ca: 22.0, p: 12.0, lys: 7.0, met: 4.5, na: 4.0
      },
      aditivos: ["Vitaminas", "Minerales", "DL-Met", "Coccidiostato"],
      requiere_extras: []
    },

    // ============ MARCAS REALES MX ============
    {
      id: "nutek-postura-2",
      nombre: "Nutek Postura 2.5%",
      marca: "Nutek México",
      tipo: "ponedora",
      etapas: ["fase1", "fase2"],
      inclusion: 2.5,
      precio: 34.50,
      descripcion: "Premezcla Nutek para gallina ponedora. Cáscara de calidad superior con yema pigmentada.",
      aportes: {
        em: 0, pc: 14.5, ca: 92.0, p: 14.0, lys: 5.2, met: 3.6, na: 4.2
      },
      aditivos: ["Vitaminas Nutek", "Carbonato calcio fino+grueso", "Pigmento marigold", "Coccidiostato"],
      requiere_extras: []
    },
    {
      id: "nutek-engorda-2",
      nombre: "Nutek Pollo de Engorda 2.5%",
      marca: "Nutek México",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento"],
      inclusion: 2.5,
      precio: 39.00,
      descripcion: "Premezcla Nutek balanceada para pollo de engorda comercial.",
      aportes: {
        em: 0, pc: 18.5, ca: 22.0, p: 12.5, lys: 6.8, met: 4.3, na: 4.5
      },
      aditivos: ["Premezcla vit/min", "AA sintéticos", "Coccidiostato Salinomicina", "Antioxidante"],
      requiere_extras: []
    },
    {
      id: "malta-postura",
      nombre: "Malta Cleyton Postura",
      marca: "Malta Cleyton",
      tipo: "ponedora",
      etapas: ["fase1", "fase2", "fase3"],
      inclusion: 3.0,
      precio: 32.00,
      descripcion: "Premezcla Malta Cleyton — la marca de referencia en muchas granjas mexicanas.",
      aportes: {
        em: 0, pc: 15.5, ca: 80.0, p: 13.5, lys: 5.8, met: 3.8, na: 4.0
      },
      aditivos: ["Vitaminas", "Minerales orgánicos", "Carbonato", "Pigmentos"],
      requiere_extras: []
    },
    {
      id: "malta-engorda",
      nombre: "Malta Cleyton Engorda",
      marca: "Malta Cleyton",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador"],
      inclusion: 3.0,
      precio: 36.00,
      descripcion: "Premezcla Malta para pollo de engorda con coccidiostato incluido.",
      aportes: {
        em: 0, pc: 19.0, ca: 21.0, p: 12.0, lys: 6.5, met: 4.0, na: 4.2
      },
      aditivos: ["Vitaminas A,D,E,K", "Minerales", "Coccidiostato", "Promotor digestivo"],
      requiere_extras: []
    },
    {
      id: "biomin-poultry",
      nombre: "BIOMIN PoultryStar 2%",
      marca: "BIOMIN",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador"],
      inclusion: 2.0,
      precio: 52.00,
      descripcion: "Premezcla BIOMIN con probióticos y fitogénicos. Premium para producción sin antibióticos.",
      aportes: {
        em: 0, pc: 16.0, ca: 25.0, p: 13.0, lys: 7.0, met: 4.5, na: 5.0
      },
      aditivos: ["Probióticos multi-cepa", "Fitogénicos", "Vitaminas", "Minerales orgánicos"],
      requiere_extras: []
    },
    {
      id: "trouw-postura",
      nombre: "Trouw Nutrition Layer 2.5%",
      marca: "Trouw Nutrition (Selko)",
      tipo: "ponedora",
      etapas: ["fase1", "fase2"],
      inclusion: 2.5,
      precio: 41.00,
      descripcion: "Premezcla Trouw para gallina ponedora con tecnología LifeStart.",
      aportes: {
        em: 0, pc: 14.0, ca: 95.0, p: 14.0, lys: 5.0, met: 3.8, na: 4.0
      },
      aditivos: ["Vitaminas premium", "Minerales orgánicos Selko", "Carbonato calidad cáscara"],
      requiere_extras: []
    },
    {
      id: "dsm-rovimix",
      nombre: "DSM Rovimix Pollo 1%",
      marca: "DSM (Vitaminas)",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador"],
      inclusion: 1.0,
      precio: 78.00,
      descripcion: "Núcleo concentrado DSM al 1% — solo vitaminas + minerales traza. Para nutricionistas que formulan completo.",
      aportes: {
        em: 0, pc: 0, ca: 0, p: 0, lys: 0, met: 0, na: 0
      },
      aditivos: ["Vitaminas DSM (A,D3,E,K,B-completo)", "Minerales traza orgánicos", "Antioxidante natural"],
      requiere_extras: ["calcio", "fosforo", "metionina", "lisina", "sal"]
    },
    {
      id: "alltech-poultry",
      nombre: "Alltech Premix Avícola",
      marca: "Alltech",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador"],
      inclusion: 2.0,
      precio: 58.00,
      descripcion: "Premezcla Alltech con minerales orgánicos Bioplex y selenio orgánico Sel-Plex.",
      aportes: {
        em: 0, pc: 12.0, ca: 28.0, p: 14.0, lys: 5.0, met: 3.5, na: 4.5
      },
      aditivos: ["Bioplex Cu/Zn/Mn", "Sel-Plex", "Vitaminas", "Yea-Sacc"],
      requiere_extras: []
    },
    {
      id: "evonik-aminocheck",
      nombre: "Evonik Núcleo AA 2%",
      marca: "Evonik",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento"],
      inclusion: 2.0,
      precio: 62.00,
      descripcion: "Núcleo Evonik con AminoBalance — máxima eficiencia de aminoácidos.",
      aportes: {
        em: 0, pc: 30.0, ca: 22.0, p: 12.0, lys: 12.0, met: 8.0, na: 4.0
      },
      aditivos: ["DL-Met (alta inclusión)", "L-Lys", "L-Thr", "L-Val", "Vitaminas", "Minerales"],
      requiere_extras: []
    },

    // ============ NUEVOS — engorda México ============
    {
      id: "purina-engorda-3",
      nombre: "Purina Premier Engorda 3%",
      marca: "Purina México",
      tipo: "engorda",
      etapas: ["iniciador", "crecimiento", "finalizador"],
      inclusion: 3.0,
      precio: 35.50,
      descripcion: "Premezcla Purina ampliamente disponible en sur y centro de México. Buena relación calidad-precio.",
      aportes: {
        em: 0, pc: 18.0, ca: 21.5, p: 12.0, lys: 6.2, met: 4.0, na: 4.2
      },
      aditivos: ["Vitaminas", "Minerales traza", "Coccidiostato", "Antioxidante"],
      requiere_extras: []
    },
    {
      id: "apc-prematix",
      nombre: "APC Prematix Pollo 2.5%",
      marca: "APC México",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador"],
      inclusion: 2.5,
      precio: 41.00,
      descripcion: "Premezcla APC con plasma porcino para mejorar inmunidad en primera semana.",
      aportes: {
        em: 0, pc: 19.0, ca: 22.5, p: 12.5, lys: 6.8, met: 4.3, na: 4.5
      },
      aditivos: ["Plasma porcino", "Vitaminas", "Minerales", "Coccidiostato", "Probióticos"],
      requiere_extras: []
    },
    {
      id: "novus-mhi",
      nombre: "Novus Núcleo MHA 2%",
      marca: "Novus International",
      tipo: "engorda",
      etapas: ["preiniciador", "iniciador", "crecimiento", "finalizador"],
      inclusion: 2.0,
      precio: 55.00,
      descripcion: "Núcleo Novus con MHA (Metionina hidroxianáloga) — más eficiente que DL-Met estándar.",
      aportes: {
        em: 0, pc: 18.0, ca: 24.0, p: 13.0, lys: 7.5, met: 6.5, na: 4.5
      },
      aditivos: ["MHA (Met líquida)", "Vitaminas", "Minerales orgánicos", "Mintrex"],
      requiere_extras: []
    },

    // ============ NUEVOS — postura México ============
    {
      id: "purina-postura-25",
      nombre: "Purina Hi-Pro Postura 2.5%",
      marca: "Purina México",
      tipo: "ponedora",
      etapas: ["fase1", "fase2"],
      inclusion: 2.5,
      precio: 33.50,
      descripcion: "Premezcla Purina para postura comercial. Disponible en presentaciones de 25 kg.",
      aportes: {
        em: 0, pc: 14.0, ca: 88.0, p: 13.5, lys: 5.0, met: 3.5, na: 4.0
      },
      aditivos: ["Vitaminas", "Carbonato fino+grueso", "Pigmento amarillo", "DL-Met"],
      requiere_extras: []
    },
    {
      id: "yara-postura-2",
      nombre: "Yara Premix Postura 2%",
      marca: "Yara Animal Nutrition",
      tipo: "ponedora",
      etapas: ["fase1", "fase2", "fase3"],
      inclusion: 2.0,
      precio: 38.00,
      descripcion: "Premezcla Yara con minerales orgánicos para huevo de cáscara firme. Calidad europea.",
      aportes: {
        em: 0, pc: 13.5, ca: 96.0, p: 14.5, lys: 4.8, met: 3.6, na: 4.2
      },
      aditivos: ["Vitaminas premium", "Minerales orgánicos", "Carbonato calcio premium", "Pigmento natural"],
      requiere_extras: []
    },
    {
      id: "elanco-coban-postura",
      nombre: "Elanco Postura Plus 2.5%",
      marca: "Elanco México",
      tipo: "ponedora",
      etapas: ["fase1", "fase2"],
      inclusion: 2.5,
      precio: 36.50,
      descripcion: "Premezcla Elanco con probióticos y enzimas para mejor aprovechamiento del calcio.",
      aportes: {
        em: 0, pc: 14.5, ca: 92.0, p: 14.0, lys: 5.2, met: 3.7, na: 4.2
      },
      aditivos: ["Vitaminas", "Probiótico Bacillus", "Fitasa", "Carbonato premium", "Pigmento marigold"],
      requiere_extras: []
    },
    {
      id: "phileo-postura",
      nombre: "Phileo Lallemand Layer 2%",
      marca: "Phileo Lallemand",
      tipo: "ponedora",
      etapas: ["fase1", "fase2", "fase3"],
      inclusion: 2.0,
      precio: 44.00,
      descripcion: "Premium con levadura de cervecería viva para inmunidad intestinal. Top de gama.",
      aportes: {
        em: 0, pc: 13.0, ca: 100.0, p: 15.0, lys: 4.5, met: 3.4, na: 4.0
      },
      aditivos: ["Levadura viva", "Pared celular MOS", "Vitaminas", "Minerales orgánicos"],
      requiere_extras: []
    },

    // ============ NUEVOS — reproductora ============
    {
      id: "cargill-breeder",
      nombre: "Cargill Breeder 2.5%",
      marca: "Cargill Animal Nutrition",
      tipo: "reproductora",
      etapas: ["rep-pico", "rep-media", "rep-final"],
      inclusion: 2.5,
      precio: 48.00,
      descripcion: "Premezcla Cargill diseñada para máxima fertilidad y calidad embrionaria.",
      aportes: {
        em: 0, pc: 15.0, ca: 78.0, p: 12.5, lys: 4.8, met: 3.5, na: 4.2
      },
      aditivos: ["Vit E alta", "Selenio orgánico", "Carotenoides", "Carbonato", "Omega-3 (DHA)"],
      requiere_extras: []
    },
    {
      id: "delacon-breeder",
      nombre: "Delacon Phytogenics Breeder 2%",
      marca: "Delacon",
      tipo: "reproductora",
      etapas: ["rep-pico", "rep-media", "rep-final"],
      inclusion: 2.0,
      precio: 56.00,
      descripcion: "Núcleo con fitogénicos para reducir antibióticos en reproductora. Tendencia europea.",
      aportes: {
        em: 0, pc: 14.0, ca: 82.0, p: 13.0, lys: 4.5, met: 3.3, na: 4.0
      },
      aditivos: ["Aceites esenciales (orégano, tomillo)", "Vit E", "Selenio orgánico", "Carbonato"],
      requiere_extras: []
    },

    // ============ NUEVOS — pavo ============
    {
      id: "novus-pavo",
      nombre: "Novus Turkey Premier 2.5%",
      marca: "Novus International",
      tipo: "pavo",
      etapas: ["pavo-preini", "pavo-ini", "pavo-crec"],
      inclusion: 2.5,
      precio: 52.00,
      descripcion: "Premezcla Novus para pavo con MHA y mineral orgánico. Ideal para alta densidad nutricional.",
      aportes: {
        em: 0, pc: 23.0, ca: 27.0, p: 14.5, lys: 9.0, met: 6.0, na: 4.5
      },
      aditivos: ["MHA", "Mintrex Mn alto", "Vitaminas", "Coccidiostato"],
      requiere_extras: []
    },

    // ============ NUEVOS — doble propósito ============
    {
      id: "premix-criollo-economico",
      nombre: "Premix Rural Criolla 5%",
      marca: "Distribución regional",
      tipo: "doble_proposito",
      etapas: ["dp-ini", "dp-crec", "dp-post", "dp-mant"],
      inclusion: 5.0,
      precio: 22.00,
      descripcion: "Núcleo económico para sistemas rústicos y traspatio. Fórmula simple, alta inclusión.",
      aportes: {
        em: 800, pc: 16.0, ca: 50.0, p: 9.0, lys: 3.5, met: 2.5, na: 3.0
      },
      aditivos: ["Vitaminas básicas", "Minerales traza", "Carbonato"],
      requiere_extras: []
    }
  ],

  // ============================================
  // RECOMENDACIONES POR DEFECTO POR TIPO+ETAPA
  // (qué inclusión recomendar como primera opción)
  // ============================================
  RECOMENDACIONES: {
    engorda: {
      preiniciador: { inclusionPreferida: 2.5, justificacion: "Alta densidad nutricional crítica en primera semana — usa núcleo 2.5% premium" },
      iniciador: { inclusionPreferida: 2.5, justificacion: "Mantén alta densidad nutricional en arranque" },
      crecimiento: { inclusionPreferida: 2.5, justificacion: "Etapa de mayor consumo — equilibra costo y densidad" },
      finalizador: { inclusionPreferida: 2.5, justificacion: "Acabado — energía alta, proteína moderada" },
      retiro: { inclusionPreferida: 5.0, justificacion: "Sin coccidiostato — núcleo simple al 5%" }
    },
    ponedora: {
      "pollita-ini": { inclusionPreferida: 2.5, justificacion: "Pollita en crianza" },
      "pollita-crec": { inclusionPreferida: 2.5, justificacion: "Crianza con núcleo balanceado" },
      "pollona-des": { inclusionPreferida: 2.5, justificacion: "Desarrollo pre-postura" },
      prepostura: { inclusionPreferida: 2.5, justificacion: "Calcio en aumento" },
      fase1: { inclusionPreferida: 2.5, justificacion: "Pico de postura — prioridad cáscara y eficiencia" },
      fase2: { inclusionPreferida: 2.5, justificacion: "Postura media — mantén calidad" },
      fase3: { inclusionPreferida: 5.0, justificacion: "Postura final — núcleo más económico" }
    },
    reproductora: {
      "rep-ini": { inclusionPreferida: 2.5, justificacion: "Iniciación reproductora" },
      "rep-crec": { inclusionPreferida: 2.5, justificacion: "Crecimiento controlado" },
      "rep-des": { inclusionPreferida: 2.5, justificacion: "Desarrollo previo a postura" },
      "rep-prepost": { inclusionPreferida: 2.5, justificacion: "Pre-postura crítica" },
      "rep-pico": { inclusionPreferida: 2.5, justificacion: "Pico de huevo fértil — vit E premium" },
      "rep-media": { inclusionPreferida: 2.5, justificacion: "Postura media reproductora" },
      "rep-final": { inclusionPreferida: 2.5, justificacion: "Postura final — mantén fertilidad" }
    },
    pavo: {
      "pavo-preini": { inclusionPreferida: 2.5, justificacion: "Pavo joven exigente — núcleo concentrado" },
      "pavo-ini": { inclusionPreferida: 2.5, justificacion: "Iniciador pavo" },
      "pavo-crec": { inclusionPreferida: 2.5, justificacion: "Crecimiento pavo" },
      "pavo-des": { inclusionPreferida: 2.5, justificacion: "Desarrollo pavo" },
      "pavo-fin": { inclusionPreferida: 2.5, justificacion: "Finalizador pavo" },
      "pavo-acab": { inclusionPreferida: 2.5, justificacion: "Acabado pavo" }
    },
    doble_proposito: {
      "dp-ini": { inclusionPreferida: 5.0, justificacion: "Criolla — núcleo simple económico" },
      "dp-crec": { inclusionPreferida: 5.0, justificacion: "Crecimiento criolla" },
      "dp-post": { inclusionPreferida: 5.0, justificacion: "Postura criolla rústica" },
      "dp-mant": { inclusionPreferida: 5.0, justificacion: "Mantenimiento adulto" }
    },
    generico: {
      "nrc-ini": { inclusionPreferida: 2.5, justificacion: "Estándar NRC iniciador" },
      "nrc-crec": { inclusionPreferida: 2.5, justificacion: "Estándar NRC crecimiento" },
      "nrc-fin": { inclusionPreferida: 2.5, justificacion: "Estándar NRC finalizador" }
    }
  },

  // ============================================
  // HELPERS
  // ============================================

  // Filtra núcleos compatibles con tipo + etapa
  filtrarPorTipoEtapa(tipo, etapaId) {
    return this.CATALOGO.filter(n =>
      n.tipo === tipo && (n.etapas.includes(etapaId) || n.etapas.length === 0)
    );
  },

  // Obtiene núcleos personalizados del usuario (localStorage)
  getNucleosPropios() {
    return JSON.parse(localStorage.getItem("fm_nucleos_propios") || "[]");
  },

  saveNucleosPropios(list) {
    localStorage.setItem("fm_nucleos_propios", JSON.stringify(list));
  },

  // Lista completa: catálogo + propios
  getTodos() {
    return [...this.CATALOGO, ...this.getNucleosPropios()];
  },

  // ============================================
  // DETECCIÓN AUTOMÁTICA: ¿qué núcleo conviene?
  // Retorna el mejor núcleo + justificación + ranking
  // ============================================

  detectarMejorNucleo(tipo, etapaId, presupuesto = "balanceado") {
    // presupuesto: "economico" | "balanceado" | "premium"

    const recomendacion = (this.RECOMENDACIONES[tipo] || {})[etapaId];
    const inclusionPreferida = recomendacion?.inclusionPreferida || 2.5;
    const justificacionEtapa = recomendacion?.justificacion || "Recomendación estándar";

    // Filtrar candidatos compatibles
    const candidatos = this.getTodos().filter(n =>
      n.tipo === tipo && (n.etapas.includes(etapaId) || n.etapas.length === 0)
    );

    if (candidatos.length === 0) {
      return {
        sugerido: null,
        ranking: [],
        razon: "No hay núcleos disponibles para esta combinación. Te sugerimos crear uno propio o usar formulación completa."
      };
    }

    // Calcular score de cada candidato
    const scored = candidatos.map(n => {
      let score = 0;
      const razones = [];

      // 1. Inclusión cercana a la recomendada
      const diffIncl = Math.abs(n.inclusion - inclusionPreferida);
      if (diffIncl < 0.5) { score += 30; razones.push(`Inclusión ${n.inclusion}% es la recomendada para esta etapa`); }
      else if (diffIncl < 1.5) { score += 15; }

      // 2. Etapa coincide exactamente
      if (n.etapas.includes(etapaId)) { score += 25; razones.push("Diseñado para esta etapa específica"); }

      // 3. Bonus por presupuesto
      if (presupuesto === "economico") {
        if (n.precio < 35) { score += 20; razones.push("Precio competitivo"); }
      } else if (presupuesto === "premium") {
        if (n.precio > 45) { score += 20; razones.push("Tecnología premium con minerales orgánicos"); }
        if (n.aditivos.some(a => /probiótico|fitogénico|orgánico|premium/i.test(a))) { score += 10; }
      } else { // balanceado
        if (n.precio >= 30 && n.precio <= 50) { score += 15; razones.push("Buena relación calidad-precio"); }
      }

      // 4. Penalización si requiere muchos extras
      if (n.requiere_extras && n.requiere_extras.length > 2) { score -= 10; }
      else if ((!n.requiere_extras || n.requiere_extras.length === 0)) { score += 10; razones.push("Listo para mezclar — no requiere extras"); }

      // 5. Bonus si es núcleo propio del usuario
      if (n.source === "propio") { score += 5; razones.push("Tu núcleo personalizado"); }

      return { ...n, score, razones };
    });

    // Ordenar por score descendente
    scored.sort((a, b) => b.score - a.score);

    return {
      sugerido: scored[0],
      ranking: scored.slice(0, 5),
      justificacionEtapa: justificacionEtapa,
      inclusionPreferida: inclusionPreferida
    };
  },

  // ============================================
  // CALCULAR FÓRMULA con núcleo + maíz + soya
  // ============================================

  calcularFormulaConNucleo(nucleo, requerimientos, opciones = {}) {
    const { precioMaiz = 6.50, precioSoya = 14.20, precioCalcio = 0.90, precioFosfato = 18.50, precioSal = 1.80, precioAceite = 32.00 } = opciones;

    const inclusion = nucleo.inclusion;
    const restante = 100 - inclusion;

    // Aporte del núcleo
    const aporteNucleo = {
      em: (inclusion / 100) * (nucleo.aportes.em || 0),
      pc: (inclusion / 100) * (nucleo.aportes.pc || 0),
      ca: (inclusion / 100) * (nucleo.aportes.ca || 0),
      p: (inclusion / 100) * (nucleo.aportes.p || 0),
      lys: (inclusion / 100) * (nucleo.aportes.lys || 0),
      met: (inclusion / 100) * (nucleo.aportes.met || 0)
    };

    // Faltante a cubrir con maíz + soya
    const faltante = {
      em: requerimientos.em - aporteNucleo.em,
      pc: requerimientos.pc - aporteNucleo.pc,
      ca: requerimientos.ca - aporteNucleo.ca,
      p: requerimientos.p - aporteNucleo.p
    };

    // Cálculo simplificado: maíz aporta ~3,350 kcal y 8.5% PC; soya aporta 2,440 kcal y 47.5% PC
    // Sistema de 2 ecuaciones: % maíz + % soya = restante
    // Aporte PC del maíz + soya = faltante PC
    const maizPC = 8.5, maizEM = 3350;
    const soyaPC = 47.5, soyaEM = 2440;

    // % soya = (faltante.pc * 100/restante - maizPC) / (soyaPC - maizPC) * restante / 100
    let pctSoya = ((faltante.pc / restante * 100) - maizPC) / (soyaPC - maizPC) * restante;
    if (pctSoya < 0) pctSoya = 0;
    if (pctSoya > restante) pctSoya = restante;
    let pctMaiz = restante - pctSoya;

    // Reservar espacio para Ca, P, sal y aceite si hace falta
    let pctCalcio = 0, pctFosfato = 0, pctSal = 0.35, pctAceite = 0;

    if (faltante.ca > 0.1) {
      pctCalcio = Math.max(0, (faltante.ca / 38) * 100); // carbonato 38% Ca
      pctCalcio = Math.min(pctCalcio, 10);
    }

    if (faltante.p > 0.05) {
      pctFosfato = Math.max(0, (faltante.p / 21) * 100); // fosfato monocálcico 21% P
      pctFosfato = Math.min(pctFosfato, 3);
    }

    // Calcular EM con maíz + soya tentativos
    let pctTotalConMinerales = pctMaiz + pctSoya + pctCalcio + pctFosfato + pctSal;

    // Si EM faltante > 0, agregar aceite para alcanzar
    const emConMaizSoya = (pctMaiz / 100 * maizEM) + (pctSoya / 100 * soyaEM) + aporteNucleo.em;
    if (emConMaizSoya < requerimientos.em - 50) {
      const emFaltante = requerimientos.em - emConMaizSoya;
      pctAceite = Math.min(emFaltante / 8800 * 100, 5);
    }

    // Reajustar maíz para que sume 100
    const sumaSinMaiz = pctSoya + pctCalcio + pctFosfato + pctSal + pctAceite + inclusion;
    pctMaiz = 100 - sumaSinMaiz;
    if (pctMaiz < 30) {
      // Si quedó muy bajo, reducir soya y reajustar
      const exceso = 30 - pctMaiz;
      pctSoya = Math.max(0, pctSoya - exceso);
      pctMaiz = 30;
    }

    // Construir fórmula
    const formula = [
      { id: "nucleo", name: nucleo.nombre, pct: inclusion, ing: { precio: nucleo.precio, em: nucleo.aportes.em, pc: nucleo.aportes.pc, ca: nucleo.aportes.ca, p: nucleo.aportes.p, lys: nucleo.aportes.lys, met: nucleo.aportes.met, cat: "nucleo" } },
      { id: "maiz", name: "Maíz amarillo", pct: pctMaiz, ing: { precio: precioMaiz, em: maizEM, pc: maizPC, ca: 0.02, p: 0.08, lys: 0.20, met: 0.18, cat: "cereal" } },
      { id: "soya48", name: "Pasta soya 48%", pct: pctSoya, ing: { precio: precioSoya, em: soyaEM, pc: soyaPC, ca: 0.32, p: 0.32, lys: 2.85, met: 0.65, cat: "proteina" } }
    ];

    if (pctAceite > 0.1) formula.push({ id: "aceite", name: "Aceite de soya", pct: pctAceite, ing: { precio: precioAceite, em: 8800, pc: 0, ca: 0, p: 0, lys: 0, met: 0, cat: "energetico" } });
    if (pctCalcio > 0.05) formula.push({ id: "carb", name: "Carbonato de calcio", pct: pctCalcio, ing: { precio: precioCalcio, em: 0, pc: 0, ca: 38, p: 0, lys: 0, met: 0, cat: "mineral" } });
    if (pctFosfato > 0.05) formula.push({ id: "fosf", name: "Fosfato monocálcico", pct: pctFosfato, ing: { precio: precioFosfato, em: 0, pc: 0, ca: 16, p: 21, lys: 0, met: 0, cat: "mineral" } });
    formula.push({ id: "sal", name: "Sal común", pct: pctSal, ing: { precio: precioSal, em: 0, pc: 0, ca: 0, p: 0, lys: 0, met: 0, cat: "mineral" } });

    // Filtrar % muy pequeños
    const formulaLimpia = formula.filter(f => f.pct > 0.05);

    // Recalcular perfil final
    let perfil = { em: 0, pc: 0, ca: 0, p: 0, lys: 0, met: 0 };
    let costoTon = 0;
    formulaLimpia.forEach(f => {
      const factor = f.pct / 100;
      perfil.em += factor * (f.ing.em || 0);
      perfil.pc += factor * (f.ing.pc || 0);
      perfil.ca += factor * (f.ing.ca || 0);
      perfil.p += factor * (f.ing.p || 0);
      perfil.lys += factor * (f.ing.lys || 0);
      perfil.met += factor * (f.ing.met || 0);
      costoTon += factor * 1000 * f.ing.precio;
    });

    // Sumar lys/met del núcleo (vienen en porcentaje del núcleo, no del total)
    perfil.lys += (inclusion / 100) * (nucleo.aportes.lys || 0);
    perfil.met += (inclusion / 100) * (nucleo.aportes.met || 0);

    return {
      formula: formulaLimpia,
      perfil,
      costoTon,
      nucleoUsado: nucleo
    };
  }
};
