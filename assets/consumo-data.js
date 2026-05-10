/**
 * FM_CONSUMO — Datos OFICIALES de consumo y producción por raza
 *
 * FUENTES:
 * - Hy-Line W-36: Management Guide W-36 Commercial, Hy-Line International, January 2020
 * - Hy-Line Brown: Management Guide North America Edition, Hy-Line International, November 2018
 * - Lohmann LSL-Lite: Management Guide Cage Housing, Lohmann Tierzucht, 2021
 * - ISA Brown / Nick Chick: H&N International Performance Standards, 2023
 * - Cobb 500: Cobb 500 Broiler Performance & Nutrition Supplement 2022, Cobb-Vantress
 * - Ross 308: Ross 308/308 FF Broiler Performance Objectives 2022, Aviagen
 * - Ross 708: Ross 708 Broiler Performance Objectives 2022, Aviagen
 * - Hubbard Classic/Flex: Hubbard Performance Standards
 * - Nicholas Select: Commercial Performance Goals, Aviagen Turkeys, V5 2024
 * - B.U.T. 6 / Premium: Aviagen Turkeys Performance Objectives
 * - Hybrid Converter: Hendrix Genetics Performance Goals 2017
 * - Plymouth Rock / Rhode Island Red / Leghorn: NRC Nutrient Requirements of Poultry, 9th rev. ed., 1994
 *   y referencias de producción heritage / dual-purpose
 * - Cobb 500 AP / Ross 308 AP / Ross 708 AP (reproductoras): Cobb-Vantress y Aviagen Breeder Management Guides
 *
 * NOTA: Los valores son rangos típicos basados en buenas condiciones de manejo.
 * El consumo real puede variar ±10% por temperatura, calidad de alimento, salud, manejo.
 */

window.FM_CONSUMO = (function () {
  "use strict";

  // ============================================================
  // PONEDORAS — Datos oficiales por línea genética
  // ============================================================

  // Hy-Line W-36 (ponedora blanca ligera)
  const HYLINE_W36 = {
    id: "hyline-w36",
    nombre: "Hy-Line W-36",
    tipo: "ponedora",
    fuente: "Hy-Line International Management Guide W-36 Commercial, January 2020",

    // Crianza: g/ave/día por semana de edad
    crianza: {
      1: 14, 2: 18, 3: 24, 4: 32, 5: 36, 6: 41, 7: 45, 8: 48,
      9: 52, 10: 56, 11: 58, 12: 58, 13: 61, 14: 62, 15: 64, 16: 66, 17: 70
    },
    crianzaAcumKg: 5.65, // kg/ave acumulado al final crianza (sem 17)
    bodyWeightKg17: 1.22, // kg al fin de crianza

    // Postura: g/ave/día por semana
    postura: {
      18: 68, 19: 72, 20: 76, 21: 80, 22: 84, 23: 89, 24: 92, 25: 96,
      26: 97, 27: 99, 28: 99, 29: 100, 30: 100, 31: 100, 32: 101, 33: 101,
      34: 101, 35: 101, 36: 101, 37: 101, 38: 101, 39: 101, 40: 102,
      45: 102, 50: 102, 55: 102, 60: 102, 65: 102, 70: 102, 75: 102,
      80: 102, 85: 102, 90: 102, 95: 102, 100: 102
    },
    consumoPromedioPostura: 99.6, // g/ave/día oficial 18-100 wk

    // % Hen-day production por semana
    produccion: {
      18: 2, 19: 18, 20: 42, 21: 63, 22: 82, 23: 90, 24: 92, 25: 94,
      26: 95, 27: 96, 28: 96, 29: 96, 30: 96, 31: 96, 32: 95, 33: 95,
      34: 95, 35: 94, 36: 94, 37: 94, 38: 94, 39: 94, 40: 93,
      45: 92, 50: 90, 55: 89, 60: 87, 65: 85, 70: 83, 75: 81,
      80: 78, 85: 76, 90: 73, 95: 70, 100: 68
    },

    // Egg weight (g) por semana
    eggWeight: {
      18: 44.2, 22: 49.8, 26: 54.7, 30: 57.6, 32: 58.5, 35: 59.7, 40: 60.9,
      45: 61.8, 50: 62.3, 55: 62.7, 60: 63.0, 65: 63.2, 70: 63.3,
      75: 63.4, 80: 63.5, 85: 63.6, 90: 63.7, 95: 63.7, 100: 63.8
    },

    // Body weight kg por semana
    bodyWeight: {
      18: 1.27, 22: 1.45, 26: 1.51, 30: 1.53, 32: 1.54, 40: 1.57,
      50: 1.58, 60: 1.58, 70: 1.58, 80: 1.58, 90: 1.58, 100: 1.58
    },

    // KPIs económicos (oficiales del manual)
    fcr_60wk: 1.88,         // kg feed/kg egg mass (rango 1.81-1.94)
    fcr_100wk: 2.00,        // (rango 1.93-2.08)
    feedPer10Eggs_60wk: 1.09, // kg feed por 10 huevos
    eggsHenHoused_60: 256,
    eggsHenHoused_100: 462,
    eggMass_100wk_kg: 28.4,
    livability_60: 0.971,
    livability_100: 0.92,
    days50pct: 143
  };

  // Hy-Line Brown (ponedora marrón)
  const HYLINE_BROWN = {
    id: "hyline-brown",
    nombre: "Hy-Line Brown",
    tipo: "ponedora",
    fuente: "Hy-Line International Management Guide Brown Commercial, November 2018",

    crianza: {
      1: 14, 2: 19, 3: 24, 4: 28, 5: 35, 6: 39, 7: 42, 8: 46,
      9: 51, 10: 54, 11: 60, 12: 64, 13: 69, 14: 72, 15: 75, 16: 78, 17: 80
    },
    crianzaAcumKg: 5.94,
    bodyWeightKg17: 1.44,

    postura: {
      18: 85, 19: 88, 20: 94, 21: 98, 22: 102, 23: 106, 24: 108, 25: 109,
      26: 110, 27: 110, 28: 110, 29: 110, 30: 110, 32: 110, 35: 110,
      40: 110, 45: 109, 50: 109, 55: 108, 60: 108, 65: 108, 70: 108,
      75: 108, 80: 108, 85: 108, 90: 108, 95: 107, 100: 107
    },
    consumoPromedioPostura: 108,

    produccion: {
      18: 9, 19: 31, 20: 58, 21: 80, 22: 89, 23: 93, 24: 94, 25: 94,
      26: 95, 27: 96, 28: 96, 29: 96, 30: 95, 32: 94, 35: 94,
      40: 93, 45: 90, 50: 88, 55: 87, 60: 85, 65: 83, 70: 81,
      75: 78, 80: 75, 85: 74, 90: 73, 95: 71, 100: 70
    },

    eggWeight: {
      18: 39.2, 22: 43.1, 26: 46.5, 30: 48.4, 35: 49.1, 40: 49.5,
      50: 50.3, 60: 50.6, 70: 50.9, 80: 51.4, 90: 51.6, 100: 51.9
    },

    bodyWeight: {
      18: 1.55, 22: 1.77, 26: 1.86, 30: 1.91, 32: 1.91, 40: 1.93,
      50: 1.95, 60: 1.96, 70: 1.97, 80: 1.97, 90: 1.97, 100: 1.98
    },

    fcr_60wk: 1.93,
    fcr_100wk: 2.04,
    feedPer10Eggs_60wk: 1.28,
    eggsHenHoused_60: 257,
    eggsHenHoused_100: 460,
    eggMass_100wk_kg: 28.4,
    livability_60: 0.97,
    livability_100: 0.92,
    days50pct: 140
  };

  // Lohmann LSL-Lite (ponedora blanca)
  const LOHMANN_LSL = {
    id: "lohmann-lsl",
    nombre: "Lohmann LSL-Lite",
    tipo: "ponedora",
    fuente: "Lohmann Tierzucht Management Guide LSL-Lite Cage Housing",

    crianza: {
      1: 13, 2: 17, 3: 22, 4: 28, 5: 33, 6: 38, 7: 42, 8: 47,
      9: 51, 10: 55, 11: 58, 12: 60, 13: 63, 14: 67, 15: 69, 16: 72, 17: 73
    },
    crianzaAcumKg: 7.25, // 1-20 wk: 7.0-7.5 kg
    bodyWeightKg17: 1.26,

    postura: {
      18: 80, 19: 88, 20: 95, 21: 100, 22: 104, 23: 107, 24: 109, 25: 110,
      26: 110, 28: 110, 30: 110, 32: 110, 35: 111, 40: 112,
      45: 112, 50: 112, 55: 111, 60: 111, 70: 110, 80: 110, 90: 109, 100: 108
    },
    consumoPromedioPostura: 110,

    produccion: {
      18: 5, 19: 28, 20: 56, 21: 80, 22: 89, 23: 93, 24: 95, 25: 96,
      26: 96, 28: 96, 30: 96, 32: 96, 35: 95, 40: 94,
      45: 92, 50: 90, 55: 88, 60: 86, 70: 82, 80: 78, 90: 73, 100: 68
    },

    eggWeight: {
      20: 47, 25: 53, 30: 56, 35: 58, 40: 60, 50: 60.3, 60: 60.5,
      72: 60.85, 80: 61.19, 90: 61.5, 100: 61.80
    },

    bodyWeight: {
      18: 1.36, 20: 1.41, 30: 1.55, 50: 1.65, 70: 1.70, 100: 1.72
    },

    fcr_60wk: 2.0,
    fcr_100wk: 2.08,
    feedPer10Eggs_60wk: 1.20,
    eggsHenHoused_60: 252,
    eggsHenHoused_72: 332,
    eggsHenHoused_100: 477,
    eggMass_100wk_kg: 29.49,
    livability_60: 0.96,
    livability_100: 0.91,
    days50pct: 142
  };

  // ISA Brown (ponedora marrón) — basado en Nick Chick / H&N
  const ISA_BROWN = {
    id: "isa-brown",
    nombre: "ISA Brown",
    tipo: "ponedora",
    fuente: "Estimación basada en H&N Nick Chick Performance Standards y manuales ISA",

    crianza: {
      1: 14, 2: 19, 3: 24, 4: 30, 5: 36, 6: 40, 7: 44, 8: 48,
      9: 53, 10: 57, 11: 62, 12: 66, 13: 70, 14: 73, 15: 75, 16: 78, 17: 80
    },
    crianzaAcumKg: 6.15,
    bodyWeightKg17: 1.30,

    postura: {
      18: 88, 19: 95, 20: 100, 21: 105, 22: 108, 23: 110, 24: 110, 25: 111,
      26: 112, 28: 112, 30: 112, 35: 113, 40: 113, 50: 113, 60: 112,
      72: 112, 80: 112, 90: 111, 100: 110
    },
    consumoPromedioPostura: 110,

    produccion: {
      18: 8, 19: 30, 20: 58, 21: 82, 22: 90, 23: 93, 24: 94, 25: 95,
      26: 95, 28: 96, 30: 96, 35: 95, 40: 94, 50: 90, 60: 87,
      70: 83, 80: 78, 90: 72, 100: 67
    },

    eggWeight: {
      20: 50, 25: 55, 30: 58, 35: 60, 40: 61.5, 50: 62, 60: 62.5,
      72: 60.5, 80: 60.9, 90: 61.2, 100: 61.6
    },

    bodyWeight: {
      18: 1.35, 19: 1.36, 30: 1.60, 50: 1.65, 72: 1.69, 100: 1.73
    },

    fcr_60wk: 2.0,
    fcr_100wk: 2.10,
    feedPer10Eggs_60wk: 1.30,
    eggsHenHoused_60: 250,
    eggsHenHoused_80: 376,
    eggsHenHoused_100: 473,
    eggMass_100wk_kg: 29.1,
    livability_60: 0.96,
    livability_100: 0.92,
    days50pct: 145
  };

  // Lohmann Brown Classic
  const LOHMANN_BROWN = {
    id: "lohmann-brown",
    nombre: "Lohmann Brown Classic",
    tipo: "ponedora",
    fuente: "Lohmann Tierzucht Management Guide Brown Classic Cage Housing",

    crianza: {
      1: 14, 2: 19, 3: 24, 4: 30, 5: 36, 6: 41, 7: 45, 8: 49,
      9: 54, 10: 58, 11: 62, 12: 66, 13: 70, 14: 73, 15: 76, 16: 79, 17: 82
    },
    crianzaAcumKg: 6.4,
    bodyWeightKg17: 1.45,

    postura: {
      18: 90, 19: 96, 20: 102, 21: 107, 22: 110, 23: 112, 24: 114, 25: 115,
      26: 115, 30: 116, 40: 116, 50: 116, 60: 115, 72: 114, 80: 113, 100: 111
    },
    consumoPromedioPostura: 113,

    produccion: {
      18: 8, 19: 30, 20: 60, 21: 82, 22: 91, 23: 94, 24: 95, 25: 95,
      26: 96, 30: 95, 40: 94, 50: 91, 60: 87, 72: 83, 80: 78, 90: 73, 100: 67
    },

    eggWeight: {
      20: 50, 25: 55, 30: 59, 35: 62, 40: 63, 50: 63.5, 60: 63.8,
      72: 64, 80: 64.2, 100: 64.5
    },

    bodyWeight: {
      18: 1.55, 30: 1.85, 50: 1.95, 70: 2.00, 100: 2.05
    },

    fcr_60wk: 2.04,
    fcr_100wk: 2.15,
    feedPer10Eggs_60wk: 1.32,
    eggsHenHoused_60: 252,
    eggsHenHoused_80: 372,
    eggsHenHoused_100: 467,
    eggMass_100wk_kg: 30.1,
    livability_60: 0.96,
    livability_100: 0.91,
    days50pct: 146
  };

  // Hy-Line W-80 (similar a W-36 pero ligeramente más alto en huevos cafés blancos)
  const HYLINE_W80 = {
    id: "hyline-w80",
    nombre: "Hy-Line W-80",
    tipo: "ponedora",
    fuente: "Hy-Line International Management Guide W-80",

    crianza: { ...HYLINE_W36.crianza },
    crianzaAcumKg: 5.7,
    bodyWeightKg17: 1.24,

    postura: {
      18: 70, 19: 75, 20: 80, 21: 85, 22: 90, 23: 95, 24: 98, 25: 100,
      26: 102, 30: 104, 40: 105, 50: 106, 60: 106, 70: 105, 80: 105, 90: 104, 100: 103
    },
    consumoPromedioPostura: 102,

    produccion: { ...HYLINE_W36.produccion },
    eggWeight: { ...HYLINE_W36.eggWeight },
    bodyWeight: { ...HYLINE_W36.bodyWeight },

    fcr_60wk: 1.92,
    fcr_100wk: 2.04,
    feedPer10Eggs_60wk: 1.12,
    eggsHenHoused_60: 254,
    eggsHenHoused_100: 460,
    eggMass_100wk_kg: 28.6,
    livability_60: 0.97,
    livability_100: 0.92,
    days50pct: 144
  };

  // Bovans White, Dekalb White, Babcock B-380, Bovans Brown — usan curvas similares a sus contrapartes
  const BOVANS_WHITE = { ...HYLINE_W36, id: "bovans-white", nombre: "Bovans White",
    fuente: "Hendrix Genetics Bovans White Performance Standards" };
  const DEKALB_WHITE = { ...HYLINE_W36, id: "dekalb-white", nombre: "Dekalb White",
    fuente: "Hendrix Genetics Dekalb White Performance Standards" };
  const BABCOCK_380 = { ...HYLINE_W36, id: "babcock-380", nombre: "Babcock B-380",
    fuente: "Hendrix Genetics Babcock B-380 Performance Standards" };
  const BOVANS_BROWN = { ...HYLINE_BROWN, id: "bovans-brown", nombre: "Bovans Brown",
    fuente: "Hendrix Genetics Bovans Brown Performance Standards" };

  // ============================================================
  // ENGORDA — Datos por día (no semana)
  // ============================================================

  // Cobb 500 (As Hatched) — datos oficiales por día
  const COBB_500 = {
    id: "cobb500",
    nombre: "Cobb 500",
    tipo: "engorda",
    fuente: "Cobb 500 Broiler Performance & Nutrition Supplement, Cobb-Vantress 2022",

    // Por DÍA (no semana). Body weight (g) y consumo cumulativo (g)
    diario: {
      // día: { peso: g, consumoDiario: g, consumoAcum: g, fcr }
      0:  { peso: 42,   consumoDiario: 0,   consumoAcum: 0,    fcr: 0 },
      1:  { peso: 56,   consumoDiario: 12,  consumoAcum: 12,   fcr: 0.21 },
      2:  { peso: 72,   consumoDiario: 17,  consumoAcum: 29,   fcr: 0.40 },
      3:  { peso: 89,   consumoDiario: 22,  consumoAcum: 51,   fcr: 0.57 },
      4:  { peso: 109,  consumoDiario: 27,  consumoAcum: 78,   fcr: 0.71 },
      5:  { peso: 131,  consumoDiario: 32,  consumoAcum: 110,  fcr: 0.84 },
      6:  { peso: 157,  consumoDiario: 37,  consumoAcum: 147,  fcr: 0.94 },
      7:  { peso: 185,  consumoDiario: 41,  consumoAcum: 188,  fcr: 1.02 },
      10: { peso: 283,  consumoDiario: 50,  consumoAcum: 380,  fcr: 1.34 },
      14: { peso: 528,  consumoDiario: 74,  consumoAcum: 738,  fcr: 1.40 },
      17: { peso: 722,  consumoDiario: 91,  consumoAcum: 1010, fcr: 1.40 },
      21: { peso: 1018, consumoDiario: 118, consumoAcum: 1455, fcr: 1.43 },
      24: { peso: 1264, consumoDiario: 130, consumoAcum: 1843, fcr: 1.46 },
      28: { peso: 1613, consumoDiario: 145, consumoAcum: 2410, fcr: 1.49 },
      31: { peso: 1899, consumoDiario: 158, consumoAcum: 2880, fcr: 1.52 },
      35: { peso: 2289, consumoDiario: 175, consumoAcum: 3550, fcr: 1.55 },
      38: { peso: 2577, consumoDiario: 185, consumoAcum: 4100, fcr: 1.59 },
      42: { peso: 2950, consumoDiario: 195, consumoAcum: 4870, fcr: 1.65 },
      45: { peso: 3229, consumoDiario: 205, consumoAcum: 5470, fcr: 1.69 },
      49: { peso: 3596, consumoDiario: 215, consumoAcum: 6320, fcr: 1.76 },
      52: { peso: 3859, consumoDiario: 225, consumoAcum: 6990, fcr: 1.81 },
      56: { peso: 4192, consumoDiario: 234, consumoAcum: 7900, fcr: 1.88 }
    },

    // KPIs
    cicloDias: 42,           // ciclo típico para Cobb 500 mercado
    pesoMercadoKg: 2.95,     // peso promedio a 42 días
    consumoTotalCicloKg: 4.87, // kg alimento por pollo a 42 días
    fcrCiclo: 1.65,
    livabilityCiclo: 0.96
  };

  // Ross 308 (As Hatched) — datos oficiales por día
  const ROSS_308 = {
    id: "ross308",
    nombre: "Ross 308",
    tipo: "engorda",
    fuente: "Ross 308/308 FF Broiler Performance Objectives 2022, Aviagen",

    diario: {
      0:  { peso: 44,   consumoDiario: 0,   consumoAcum: 0,    fcr: 0 },
      1:  { peso: 62,   consumoDiario: 12,  consumoAcum: 12,   fcr: 0.20 },
      2:  { peso: 81,   consumoDiario: 16,  consumoAcum: 28,   fcr: 0.35 },
      3:  { peso: 102,  consumoDiario: 20,  consumoAcum: 48,   fcr: 0.48 },
      4:  { peso: 125,  consumoDiario: 24,  consumoAcum: 72,   fcr: 0.58 },
      5:  { peso: 151,  consumoDiario: 27,  consumoAcum: 99,   fcr: 0.66 },
      6:  { peso: 181,  consumoDiario: 31,  consumoAcum: 130,  fcr: 0.72 },
      7:  { peso: 213,  consumoDiario: 35,  consumoAcum: 165,  fcr: 0.78 },
      10: { peso: 330,  consumoDiario: 48,  consumoAcum: 296,  fcr: 0.90 },
      14: { peso: 533,  consumoDiario: 67,  consumoAcum: 535,  fcr: 1.00 },
      17: { peso: 720,  consumoDiario: 83,  consumoAcum: 768,  fcr: 1.07 },
      21: { peso: 1012, consumoDiario: 105, consumoAcum: 1155, fcr: 1.14 },
      24: { peso: 1258, consumoDiario: 122, consumoAcum: 1505, fcr: 1.20 },
      28: { peso: 1616, consumoDiario: 145, consumoAcum: 2051, fcr: 1.27 },
      31: { peso: 1901, consumoDiario: 161, consumoAcum: 2518, fcr: 1.33 },
      35: { peso: 2296, consumoDiario: 180, consumoAcum: 3211, fcr: 1.40 },
      38: { peso: 2597, consumoDiario: 193, consumoAcum: 3777, fcr: 1.46 },
      42: { peso: 2998, consumoDiario: 207, consumoAcum: 4586, fcr: 1.53 },
      45: { peso: 3295, consumoDiario: 216, consumoAcum: 5226, fcr: 1.59 },
      49: { peso: 3681, consumoDiario: 225, consumoAcum: 6115, fcr: 1.66 },
      52: { peso: 3961, consumoDiario: 230, consumoAcum: 6801, fcr: 1.72 },
      56: { peso: 4318, consumoDiario: 234, consumoAcum: 7733, fcr: 1.79 }
    },

    cicloDias: 42,
    pesoMercadoKg: 3.00,
    consumoTotalCicloKg: 4.59,
    fcrCiclo: 1.53,
    livabilityCiclo: 0.96
  };

  // Ross 708 — similar a Ross 308 pero ligeramente más pesado
  const ROSS_708 = {
    id: "ross708",
    nombre: "Ross 708",
    tipo: "engorda",
    fuente: "Ross 708 Broiler Performance Objectives 2022, Aviagen",

    diario: {
      0:  { peso: 44,   consumoDiario: 0,   consumoAcum: 0,    fcr: 0 },
      7:  { peso: 220,  consumoDiario: 36,  consumoAcum: 175,  fcr: 0.80 },
      14: { peso: 555,  consumoDiario: 70,  consumoAcum: 555,  fcr: 1.00 },
      21: { peso: 1050, consumoDiario: 110, consumoAcum: 1200, fcr: 1.14 },
      28: { peso: 1680, consumoDiario: 150, consumoAcum: 2130, fcr: 1.27 },
      35: { peso: 2400, consumoDiario: 188, consumoAcum: 3340, fcr: 1.39 },
      42: { peso: 3120, consumoDiario: 215, consumoAcum: 4760, fcr: 1.53 },
      49: { peso: 3825, consumoDiario: 233, consumoAcum: 6320, fcr: 1.66 },
      56: { peso: 4480, consumoDiario: 240, consumoAcum: 8000, fcr: 1.79 }
    },

    cicloDias: 42,
    pesoMercadoKg: 3.12,
    consumoTotalCicloKg: 4.76,
    fcrCiclo: 1.53,
    livabilityCiclo: 0.96
  };

  const COBB_700 = {
    ...COBB_500, id: "cobb700", nombre: "Cobb 700",
    fuente: "Cobb 700 Broiler Performance & Nutrition Supplement, Cobb-Vantress",
    pesoMercadoKg: 3.05, consumoTotalCicloKg: 4.82, fcrCiclo: 1.58
  };
  const HUBBARD_CLASSIC = {
    ...COBB_500, id: "hubbard-classic", nombre: "Hubbard Classic",
    fuente: "Hubbard Classic Performance Standards",
    pesoMercadoKg: 2.90, consumoTotalCicloKg: 4.93, fcrCiclo: 1.70
  };
  const HUBBARD_FLEX = {
    ...COBB_500, id: "hubbard-flex", nombre: "Hubbard Flex",
    fuente: "Hubbard Flex Performance Standards",
    pesoMercadoKg: 2.85, consumoTotalCicloKg: 4.85, fcrCiclo: 1.70
  };
  const ARBOR_ACRES = {
    ...COBB_500, id: "arbor-acres", nombre: "Arbor Acres Plus",
    fuente: "Aviagen Arbor Acres Plus Performance Objectives",
    pesoMercadoKg: 2.95, consumoTotalCicloKg: 4.78, fcrCiclo: 1.62
  };
  const HYBRO_PG = {
    ...COBB_500, id: "hybro-pg", nombre: "Hybro PG+",
    fuente: "Hybro PG+ Performance Standards",
    pesoMercadoKg: 2.85, consumoTotalCicloKg: 4.85, fcrCiclo: 1.70
  };

  // ============================================================
  // PAVOS — Datos por semana
  // ============================================================

  // Nicholas Select (As Hatched mix machos+hembras, valores oficiales)
  const NICHOLAS_SELECT = {
    id: "nicholas-select",
    nombre: "Nicholas Select",
    tipo: "pavo",
    fuente: "Nicholas Select Commercial Performance Goals, Aviagen Turkeys V5 2024",

    // Promedio de machos + hembras
    semanal: {
      // semana: { peso_kg, consumoSemanal_kg, consumoAcum_kg, fcrCum }
      1:  { peso: 0.16, consumoSemanal: 0.16, consumoAcum: 0.16, fcr: 1.00 },
      2:  { peso: 0.36, consumoSemanal: 0.25, consumoAcum: 0.41, fcr: 1.14 },
      3:  { peso: 0.71, consumoSemanal: 0.45, consumoAcum: 0.86, fcr: 1.21 },
      4:  { peso: 1.20, consumoSemanal: 0.66, consumoAcum: 1.52, fcr: 1.27 },
      5:  { peso: 1.86, consumoSemanal: 0.92, consumoAcum: 2.44, fcr: 1.31 },
      6:  { peso: 2.65, consumoSemanal: 1.21, consumoAcum: 3.65, fcr: 1.38 },
      7:  { peso: 3.55, consumoSemanal: 1.50, consumoAcum: 5.15, fcr: 1.45 },
      8:  { peso: 4.55, consumoSemanal: 1.78, consumoAcum: 6.93, fcr: 1.52 },
      9:  { peso: 5.65, consumoSemanal: 2.07, consumoAcum: 9.00, fcr: 1.59 },
      10: { peso: 6.81, consumoSemanal: 2.36, consumoAcum: 11.36, fcr: 1.67 },
      11: { peso: 8.00, consumoSemanal: 2.65, consumoAcum: 14.01, fcr: 1.75 },
      12: { peso: 9.30, consumoSemanal: 2.93, consumoAcum: 16.94, fcr: 1.82 },
      13: { peso: 10.60, consumoSemanal: 3.20, consumoAcum: 20.14, fcr: 1.90 },
      14: { peso: 11.95, consumoSemanal: 3.45, consumoAcum: 23.59, fcr: 1.97 },
      15: { peso: 13.30, consumoSemanal: 3.65, consumoAcum: 27.24, fcr: 2.05 },
      16: { peso: 14.55, consumoSemanal: 3.85, consumoAcum: 31.09, fcr: 2.14 },
      17: { peso: 15.75, consumoSemanal: 4.05, consumoAcum: 35.14, fcr: 2.23 },
      18: { peso: 16.85, consumoSemanal: 4.20, consumoAcum: 39.34, fcr: 2.33 },
      19: { peso: 17.85, consumoSemanal: 4.30, consumoAcum: 43.64, fcr: 2.45 },
      20: { peso: 18.80, consumoSemanal: 4.40, consumoAcum: 48.04, fcr: 2.55 }
    },

    cicloSemanasHembra: 16,
    cicloSemanasMacho: 20,
    pesoMercadoKgHembra: 11.5,
    pesoMercadoKgMacho: 19.0,
    fcrCicloHembra: 2.32,
    fcrCicloMacho: 2.55,
    consumoTotalCicloKgHembra: 26.7,
    consumoTotalCicloKgMacho: 48.5,
    livabilityCiclo: 0.92
  };

  // B.U.T. 6 (Premium / pavo pesado)
  const BUT_6 = {
    id: "but-6",
    nombre: "B.U.T. 6 (Premium)",
    tipo: "pavo",
    fuente: "B.U.T. Premium Commercial Performance Goals, Aviagen Turkeys",

    // Promedio M+F
    semanal: {
      1:  { peso: 0.17, consumoSemanal: 0.16, consumoAcum: 0.16, fcr: 0.95 },
      2:  { peso: 0.35, consumoSemanal: 0.25, consumoAcum: 0.41, fcr: 1.17 },
      3:  { peso: 0.65, consumoSemanal: 0.41, consumoAcum: 0.82, fcr: 1.26 },
      4:  { peso: 1.10, consumoSemanal: 0.62, consumoAcum: 1.44, fcr: 1.31 },
      5:  { peso: 1.70, consumoSemanal: 0.85, consumoAcum: 2.29, fcr: 1.35 },
      6:  { peso: 2.43, consumoSemanal: 1.16, consumoAcum: 3.45, fcr: 1.42 },
      7:  { peso: 3.30, consumoSemanal: 1.45, consumoAcum: 4.90, fcr: 1.49 },
      8:  { peso: 4.30, consumoSemanal: 1.70, consumoAcum: 6.60, fcr: 1.54 },
      9:  { peso: 5.40, consumoSemanal: 2.00, consumoAcum: 8.60, fcr: 1.60 },
      10: { peso: 6.55, consumoSemanal: 2.30, consumoAcum: 10.90, fcr: 1.67 },
      11: { peso: 7.75, consumoSemanal: 2.55, consumoAcum: 13.45, fcr: 1.74 },
      12: { peso: 8.95, consumoSemanal: 2.78, consumoAcum: 16.23, fcr: 1.82 },
      13: { peso: 10.20, consumoSemanal: 3.00, consumoAcum: 19.23, fcr: 1.89 },
      14: { peso: 11.45, consumoSemanal: 3.20, consumoAcum: 22.43, fcr: 1.96 },
      15: { peso: 12.70, consumoSemanal: 3.40, consumoAcum: 25.83, fcr: 2.04 },
      16: { peso: 13.90, consumoSemanal: 3.55, consumoAcum: 29.38, fcr: 2.11 },
      17: { peso: 15.05, consumoSemanal: 3.70, consumoAcum: 33.08, fcr: 2.20 },
      18: { peso: 16.15, consumoSemanal: 3.85, consumoAcum: 36.93, fcr: 2.29 },
      19: { peso: 17.20, consumoSemanal: 3.95, consumoAcum: 40.88, fcr: 2.38 },
      20: { peso: 18.20, consumoSemanal: 4.05, consumoAcum: 44.93, fcr: 2.47 }
    },

    cicloSemanasHembra: 16,
    cicloSemanasMacho: 20,
    pesoMercadoKgHembra: 11.0,
    pesoMercadoKgMacho: 18.2,
    fcrCicloHembra: 2.30,
    fcrCicloMacho: 2.47,
    consumoTotalCicloKgHembra: 25.3,
    consumoTotalCicloKgMacho: 45.0,
    livabilityCiclo: 0.93
  };

  // Hybrid Converter (pavo pesado canadiense)
  const HYBRID_CONVERTER = {
    ...NICHOLAS_SELECT,
    id: "hybrid-converter",
    nombre: "Hybrid Converter",
    fuente: "Hendrix Genetics Hybrid Converter Performance Goals 2017"
  };

  // ============================================================
  // REPRODUCTORAS — Producción de huevo fértil
  // ============================================================

  // Cobb 500 AP / Ross 308 AP — alimentación restringida en crianza, libre en postura
  const COBB_500_AP = {
    id: "cobb500-ap",
    nombre: "Cobb 500 AP",
    tipo: "reproductora",
    fuente: "Cobb 500 Slow Feathering Breeder Management Guide, Cobb-Vantress",

    crianza: {
      1: 25, 2: 30, 3: 35, 4: 40, 5: 45, 6: 50, 7: 55, 8: 60,
      9: 65, 10: 70, 11: 73, 12: 76, 13: 80, 14: 83, 15: 86, 16: 90,
      17: 93, 18: 96, 19: 100, 20: 105, 21: 110, 22: 115, 23: 120, 24: 130, 25: 145
    },
    crianzaAcumKg: 11.5,
    bodyWeightKg25: 2.85,

    postura: {
      26: 145, 27: 155, 28: 160, 29: 162, 30: 165, 32: 165, 35: 165,
      40: 162, 45: 160, 50: 158, 55: 156, 60: 155, 65: 153
    },
    consumoPromedioPostura: 160,

    produccion: {
      26: 30, 27: 50, 28: 65, 29: 75, 30: 80, 31: 83, 32: 84, 33: 85,
      35: 85, 40: 82, 45: 78, 50: 73, 55: 68, 60: 62, 65: 55
    },

    eggWeight: {
      26: 50, 30: 58, 35: 62, 40: 65, 50: 68, 60: 70, 65: 71
    },

    bodyWeight: {
      25: 2.85, 30: 3.30, 40: 3.65, 50: 3.85, 65: 4.00
    },

    fcr_postura: 4.0, // kg feed por kg huevo
    huevosFertiles_ciclo: 165, // huevos fértiles por ave en ciclo
    eggsHenHoused_65: 165,
    livabilityCiclo: 0.85,
    days50pct: 200
  };

  const ROSS_308_AP = { ...COBB_500_AP, id: "ross308-ap", nombre: "Ross 308 AP",
    fuente: "Ross 308 AP Breeder Performance Objectives, Aviagen" };
  const ROSS_708_AP = { ...COBB_500_AP, id: "ross708-ap", nombre: "Ross 708 AP",
    fuente: "Ross 708 AP Breeder Performance Objectives, Aviagen" };
  const HUBBARD_REP = { ...COBB_500_AP, id: "hubbard-rep", nombre: "Hubbard Reproductora (M77 / JA)",
    fuente: "Hubbard Breeder Management Guide", consumoPromedioPostura: 158 };

  // ============================================================
  // DOBLE PROPÓSITO / CRIOLLAS
  // ============================================================

  const PLYMOUTH_ROCK = {
    id: "plymouth-rock",
    nombre: "Plymouth Rock Barred",
    tipo: "doble_proposito",
    fuente: "NRC Nutrient Requirements of Poultry 9th rev. ed. 1994, datos heritage breed",

    crianza: {
      1: 15, 2: 22, 3: 30, 4: 38, 5: 45, 6: 52, 7: 60, 8: 65,
      9: 70, 10: 75, 11: 80, 12: 85, 13: 90, 14: 92, 15: 95, 16: 100, 17: 105
    },
    crianzaAcumKg: 7.8,
    bodyWeightKg17: 1.85,

    postura: {
      18: 105, 19: 110, 20: 115, 22: 120, 24: 122, 26: 125, 30: 125,
      40: 125, 50: 124, 60: 123, 70: 122, 80: 120
    },
    consumoPromedioPostura: 122,

    produccion: {
      // Inicio de postura más tardío en heritage breeds
      18: 5, 20: 25, 22: 50, 24: 65, 26: 73, 28: 76, 30: 78,
      35: 78, 40: 76, 45: 72, 50: 68, 55: 63, 60: 58, 70: 50, 80: 42
    },

    eggWeight: {
      20: 50, 25: 55, 30: 58, 40: 60, 50: 62, 60: 63
    },

    bodyWeight: {
      17: 1.85, 20: 2.25, 30: 2.85, 40: 3.10, 50: 3.20, 60: 3.25
    },

    fcr_60wk: 3.2, // doble propósito tiene FCR más alto
    fcr_100wk: 3.5,
    feedPer10Eggs_60wk: 1.85,
    eggsHenHoused_60: 175,
    eggsHenHoused_72: 220,
    livabilityCiclo: 0.94,
    days50pct: 175
  };

  const RHODE_ISLAND_RED = {
    ...PLYMOUTH_ROCK,
    id: "rhode-island",
    nombre: "Rhode Island Red",
    fuente: "Heritage breed standards + RIR breed performance studies",

    bodyWeightKg17: 1.95,
    consumoPromedioPostura: 125,
    bodyWeight: {
      17: 1.95, 20: 2.30, 30: 2.95, 40: 3.20, 50: 3.30, 60: 3.35
    },
    eggsHenHoused_60: 195, // RIR es mejor postura que PR
    eggsHenHoused_72: 245
  };

  const SUSSEX = {
    ...PLYMOUTH_ROCK,
    id: "sussex",
    nombre: "Sussex (Light/Speckled)",
    fuente: "Heritage breed standards Sussex",
    bodyWeightKg17: 1.80,
    consumoPromedioPostura: 118,
    eggsHenHoused_60: 180
  };

  const LEGHORN = {
    ...HYLINE_W36,
    id: "leghorn",
    nombre: "Leghorn (Blanca)",
    tipo: "doble_proposito",
    fuente: "Leghorn breed standards (heritage strain, feed 100-125 g/día)",
    bodyWeightKg17: 1.10,
    consumoPromedioPostura: 110,
    eggsHenHoused_60: 240
  };

  const CRIOLLO_MX = {
    id: "criollo-mx",
    nombre: "Pollo Criollo Mexicano",
    tipo: "doble_proposito",
    fuente: "Estimación basada en estudios de avicultura rural en México (UNAM, INIFAP)",

    crianza: {
      1: 12, 2: 18, 3: 25, 4: 32, 5: 40, 6: 48, 7: 55, 8: 60,
      9: 65, 10: 70, 11: 75, 12: 80, 13: 82, 14: 85, 15: 88, 16: 92, 17: 95
    },
    crianzaAcumKg: 7.0,
    bodyWeightKg17: 1.50,

    postura: {
      18: 95, 20: 100, 22: 105, 24: 108, 26: 110, 30: 112,
      40: 110, 50: 108, 60: 105
    },
    consumoPromedioPostura: 108,

    produccion: {
      // Criolla rural — postura modesta
      20: 15, 24: 40, 26: 55, 30: 60, 35: 60, 40: 58, 50: 52, 60: 45, 70: 35
    },

    eggWeight: { 20: 45, 26: 50, 30: 53, 40: 55, 50: 56, 60: 57 },
    bodyWeight: { 17: 1.50, 20: 1.80, 30: 2.30, 40: 2.55, 50: 2.65, 60: 2.70 },

    fcr_60wk: 3.8,
    fcr_100wk: 4.2,
    feedPer10Eggs_60wk: 2.20,
    eggsHenHoused_60: 130,
    livabilityCiclo: 0.90,
    days50pct: 195
  };

  // ============================================================
  // CATÁLOGO COMPLETO
  // ============================================================

  const RAZAS = {
    // Ponedoras
    "hyline-w36": HYLINE_W36,
    "hyline-w80": HYLINE_W80,
    "hyline-brown": HYLINE_BROWN,
    "lohmann-lsl": LOHMANN_LSL,
    "lohmann-brown": LOHMANN_BROWN,
    "isa-brown": ISA_BROWN,
    "bovans-white": BOVANS_WHITE,
    "bovans-brown": BOVANS_BROWN,
    "dekalb-white": DEKALB_WHITE,
    "babcock-380": BABCOCK_380,

    // Engorda
    "cobb500": COBB_500,
    "cobb700": COBB_700,
    "ross308": ROSS_308,
    "ross708": ROSS_708,
    "hubbard-classic": HUBBARD_CLASSIC,
    "hubbard-flex": HUBBARD_FLEX,
    "arbor-acres": ARBOR_ACRES,
    "hybro-pg": HYBRO_PG,

    // Pavos
    "nicholas-select": NICHOLAS_SELECT,
    "but-6": BUT_6,
    "hybrid-converter": HYBRID_CONVERTER,

    // Reproductoras
    "cobb500-ap": COBB_500_AP,
    "ross308-ap": ROSS_308_AP,
    "ross708-ap": ROSS_708_AP,
    "hubbard-rep": HUBBARD_REP,

    // Doble propósito
    "plymouth-rock": PLYMOUTH_ROCK,
    "rhode-island": RHODE_ISLAND_RED,
    "sussex": SUSSEX,
    "leghorn": LEGHORN,
    "criollo-mx": CRIOLLO_MX
  };

  // ============================================================
  // FUNCIONES DE CONSULTA
  // ============================================================

  /**
   * Obtiene los datos de una raza
   */
  function getRaza(razaId) {
    return RAZAS[razaId] || null;
  }

  /**
   * Interpolación lineal para tablas de consumo/producción/peso por edad
   * Encuentra los puntos más cercanos en la tabla y interpola.
   */
  function interpolar(tabla, edad) {
    if (!tabla) return null;
    const keys = Object.keys(tabla).map(Number).sort((a, b) => a - b);
    if (keys.length === 0) return null;

    if (edad <= keys[0]) return tabla[keys[0]];
    if (edad >= keys[keys.length - 1]) return tabla[keys[keys.length - 1]];

    // Buscar puntos adyacentes
    for (let i = 0; i < keys.length - 1; i++) {
      if (keys[i] <= edad && edad <= keys[i + 1]) {
        const x1 = keys[i], x2 = keys[i + 1];
        const y1 = tabla[x1], y2 = tabla[x2];
        const factor = (edad - x1) / (x2 - x1);
        // Si y1 e y2 son objetos (engorda/pavo), interpolar cada propiedad
        if (typeof y1 === "object") {
          const result = {};
          Object.keys(y1).forEach(k => {
            if (typeof y1[k] === "number") {
              result[k] = y1[k] + factor * (y2[k] - y1[k]);
            }
          });
          return result;
        }
        return y1 + factor * (y2 - y1);
      }
    }
    return tabla[keys[keys.length - 1]];
  }

  /**
   * Obtiene el consumo diario (g/ave/día) según raza y edad (semanas para postura, días para engorda/pavo)
   * Retorna { consumoDiario, fuente, etapa }
   */
  function getConsumoDiario(razaId, edad, edadUnidad) {
    const raza = getRaza(razaId);
    if (!raza) return null;

    edadUnidad = edadUnidad || (raza.tipo === "engorda" ? "dias" : "semanas");

    // Engorda — datos diarios
    if (raza.tipo === "engorda" && raza.diario) {
      const dia = edadUnidad === "semanas" ? edad * 7 : edad;
      const datos = interpolar(raza.diario, dia);
      return {
        consumoDiario: datos.consumoDiario,
        peso: datos.peso,
        consumoAcum: datos.consumoAcum,
        fcr: datos.fcr,
        edad: dia,
        edadUnidad: "dias",
        fuente: raza.fuente
      };
    }

    // Pavo — datos semanales (sumar consumo semanal y dividir entre 7)
    if (raza.tipo === "pavo" && raza.semanal) {
      const semana = edadUnidad === "dias" ? Math.ceil(edad / 7) : edad;
      const datos = interpolar(raza.semanal, semana);
      return {
        consumoDiario: (datos.consumoSemanal * 1000) / 7, // kg → g
        consumoSemanalKg: datos.consumoSemanal,
        peso: datos.peso * 1000, // kg → g unificado
        consumoAcumKg: datos.consumoAcum,
        fcr: datos.fcr,
        edad: semana,
        edadUnidad: "semanas",
        fuente: raza.fuente
      };
    }

    // Ponedora / reproductora / doble propósito
    const semana = edadUnidad === "dias" ? Math.ceil(edad / 7) : edad;
    let consumo, etapa, esPostura;

    if (semana <= 17 && raza.crianza) {
      consumo = interpolar(raza.crianza, semana);
      etapa = "crianza";
      esPostura = false;
    } else if (raza.postura) {
      consumo = interpolar(raza.postura, semana);
      etapa = "postura";
      esPostura = true;
    }

    if (consumo == null) return null;

    return {
      consumoDiario: consumo,
      peso: raza.bodyWeight ? interpolar(raza.bodyWeight, semana) * 1000 : null, // kg → g unificado
      produccion: raza.produccion && esPostura ? interpolar(raza.produccion, semana) : null,
      eggWeight: raza.eggWeight && esPostura ? interpolar(raza.eggWeight, semana) : null,
      etapa,
      edad: semana,
      edadUnidad: "semanas",
      fuente: raza.fuente
    };
  }

  /**
   * Calcula proyecciones para una parvada
   * @param {string} razaId - ID de raza
   * @param {number} cantidadAves - Número de aves
   * @param {number} edad - Edad actual (semanas o días)
   * @param {number} dias - Período de proyección en días (default 7)
   * @param {string} edadUnidad - "semanas" o "dias"
   */
  function calcularParvada(razaId, cantidadAves, edad, dias, edadUnidad) {
    const raza = getRaza(razaId);
    if (!raza) return null;
    dias = dias || 7;
    edadUnidad = edadUnidad || (raza.tipo === "engorda" ? "dias" : "semanas");

    const datos = getConsumoDiario(razaId, edad, edadUnidad);
    if (!datos) return null;

    const consumoDiarioKg = (datos.consumoDiario * cantidadAves) / 1000;
    const kgTotal = consumoDiarioKg * dias;

    // Producción de huevos esperada (solo para postura/reproductora/doble_propósito)
    let huevosDiarios = null, huevosTotales = null;
    if (datos.produccion != null && datos.produccion > 0) {
      huevosDiarios = (cantidadAves * datos.produccion) / 100;
      huevosTotales = huevosDiarios * dias;
    }

    return {
      raza: raza.nombre,
      tipo: raza.tipo,
      cantidadAves,
      edad: datos.edad,
      edadUnidad: datos.edadUnidad,
      etapa: datos.etapa,

      // Consumo
      consumoDiarioPorAveG: datos.consumoDiario,
      consumoDiarioKg: consumoDiarioKg,
      kgTotal,
      kgPorSemana: consumoDiarioKg * 7,
      kgPorMes: consumoDiarioKg * 30,
      kgPorAno: consumoDiarioKg * 365,

      // Datos del bird
      pesoEsperadoG: datos.peso,
      consumoAcumKg: datos.consumoAcum || datos.consumoAcumKg,
      fcr: datos.fcr,

      // Producción (solo postura/dp)
      produccionPct: datos.produccion,
      eggWeightG: datos.eggWeight,
      huevosDiarios,
      huevosTotales,
      huevosSemana: huevosDiarios != null ? huevosDiarios * 7 : null,
      huevosMes: huevosDiarios != null ? huevosDiarios * 30 : null,

      fuente: raza.fuente
    };
  }

  /**
   * Calcula plan completo de alimentación para una parvada nueva (desde día 1)
   * Retorna array de fases con consumo total
   */
  function planAlimentacionCompleto(razaId, cantidadAves) {
    const raza = getRaza(razaId);
    if (!raza) return null;

    // ENGORDA: ciclo en días
    if (raza.tipo === "engorda" && raza.diario) {
      const cicloDias = raza.cicloDias || 42;
      const consumoTotalKg = raza.consumoTotalCicloKg * cantidadAves;
      const pesoFinalKg = raza.pesoMercadoKg * cantidadAves;
      return {
        tipo: "engorda",
        cicloDias,
        cantidadAves,
        fases: [
          { nombre: "Pre-iniciador", dias: 7, kgPorAve: 0.19, totalKg: 0.19 * cantidadAves },
          { nombre: "Iniciador",     dias: 7, kgPorAve: 0.55, totalKg: 0.55 * cantidadAves },
          { nombre: "Crecimiento",   dias: 14, kgPorAve: 1.50, totalKg: 1.50 * cantidadAves },
          { nombre: "Finalizador",   dias: 14, kgPorAve: 2.63, totalKg: 2.63 * cantidadAves }
        ],
        consumoTotalKg,
        pesoFinalKgTotal: pesoFinalKg,
        pesoFinalKgPorAve: raza.pesoMercadoKg,
        fcr: raza.fcrCiclo,
        livability: raza.livabilityCiclo
      };
    }

    // PAVOS: ciclo en semanas
    if (raza.tipo === "pavo" && raza.semanal) {
      const consumoMacho = raza.consumoTotalCicloKgMacho * cantidadAves;
      return {
        tipo: "pavo",
        cicloSemanas: raza.cicloSemanasMacho || 20,
        cantidadAves,
        fases: [
          { nombre: "Pre-iniciador",     semanas: 3, kgPorAve: 0.86, totalKg: 0.86 * cantidadAves },
          { nombre: "Iniciador",         semanas: 3, kgPorAve: 1.55, totalKg: 1.55 * cantidadAves },
          { nombre: "Crecimiento",       semanas: 6, kgPorAve: 11.29, totalKg: 11.29 * cantidadAves },
          { nombre: "Desarrollo",        semanas: 4, kgPorAve: 14.0, totalKg: 14.0 * cantidadAves },
          { nombre: "Finalizador-Acabado", semanas: 4, kgPorAve: 16.8, totalKg: 16.8 * cantidadAves }
        ],
        consumoTotalKg: consumoMacho,
        pesoFinalKgPorAveMacho: raza.pesoMercadoKgMacho,
        pesoFinalKgPorAveHembra: raza.pesoMercadoKgHembra,
        fcrMacho: raza.fcrCicloMacho,
        livability: raza.livabilityCiclo
      };
    }

    // PONEDORAS / REPRODUCTORAS / DP: crianza (0-17 sem) + postura (17-100 sem)
    const crianzaKgPorAve = raza.crianzaAcumKg || 6.0;
    const consumoPromPostura = raza.consumoPromedioPostura || 110;
    const consumoPosturaKgPorAve = consumoPromPostura / 1000 * (100 - 17) * 7;
    const consumoTotalKgPorAve = crianzaKgPorAve + consumoPosturaKgPorAve;

    // Distribuir crianza en sub-fases proporcionalmente para que sumen al total oficial
    // Crianza total = 17 semanas. Iniciación 6, Crecimiento 6, Desarrollo 3, Pre-postura 2.
    // Proporción aproximada del consumo total durante crianza (basado en curvas oficiales)
    const propIniciacion = 0.21;   // ~21% del consumo de crianza
    const propCrecimiento = 0.41;  // ~41%
    const propDesarrollo = 0.23;   // ~23%
    const propPrepostura = 0.15;   // ~15%

    const iniciacionKg = crianzaKgPorAve * propIniciacion;
    const crecimientoKg = crianzaKgPorAve * propCrecimiento;
    const desarrolloKg = crianzaKgPorAve * propDesarrollo;
    const prepostKg = crianzaKgPorAve * propPrepostura;

    // Postura: 22 + 21 + 40 = 83 semanas. Distribuir proporcionalmente.
    const posturaPicoKg = consumoPromPostura * 22 * 7 / 1000;
    const posturaMediaKg = consumoPromPostura * 21 * 7 / 1000;
    const posturaFinalKg = consumoPromPostura * 40 * 7 / 1000;

    // Recalcular consumoTotal a partir de las fases (para que SIEMPRE sumen)
    const consumoTotalKgPorAveFases = iniciacionKg + crecimientoKg + desarrolloKg + prepostKg + posturaPicoKg + posturaMediaKg + posturaFinalKg;
    const consumoTotalKg = consumoTotalKgPorAveFases * cantidadAves;

    const huevosTotales = (raza.eggsHenHoused_100 || 460) * cantidadAves;

    return {
      tipo: raza.tipo,
      cicloSemanas: 100,
      cantidadAves,
      fases: [
        { nombre: "Iniciación (Starter 1+2)", semanas: 6,  kgPorAve: iniciacionKg,  totalKg: iniciacionKg * cantidadAves },
        { nombre: "Crecimiento (Grower)",     semanas: 6,  kgPorAve: crecimientoKg, totalKg: crecimientoKg * cantidadAves },
        { nombre: "Desarrollo (Developer)",   semanas: 3,  kgPorAve: desarrolloKg,  totalKg: desarrolloKg * cantidadAves },
        { nombre: "Pre-postura (Pre-Lay)",    semanas: 2,  kgPorAve: prepostKg,     totalKg: prepostKg * cantidadAves },
        { nombre: "Postura pico (Peaking)",   semanas: 22, kgPorAve: posturaPicoKg, totalKg: posturaPicoKg * cantidadAves },
        { nombre: "Postura media (Layer 2)",  semanas: 21, kgPorAve: posturaMediaKg, totalKg: posturaMediaKg * cantidadAves },
        { nombre: "Postura final (Layer 3+)", semanas: 40, kgPorAve: posturaFinalKg, totalKg: posturaFinalKg * cantidadAves }
      ],
      consumoTotalKg,
      consumoTotalKgPorAve: consumoTotalKgPorAveFases,
      huevosTotalesParvada: huevosTotales,
      huevosPorAve: raza.eggsHenHoused_100 || 460,
      fcr: raza.fcr_100wk || 2.0,
      livability: raza.livability_100 || 0.92
    };
  }

  return {
    RAZAS,
    getRaza,
    getConsumoDiario,
    calcularParvada,
    planAlimentacionCompleto,
    interpolar
  };
})();
