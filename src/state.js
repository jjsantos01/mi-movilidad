// Central app state and instance registry (no globals elsewhere)
export const state = {
  rawData: [],
  viajes: [],
  ecobiciViajes: [],
  timtValidations: [],
  charts: new Map(),
  mapInstances: {},
};

export function setRawData(rows) {
  state.rawData = rows || [];
}

export function setViajes(viajes) {
  state.viajes = viajes || [];
}

export function setEcobiciViajes(v) {
  state.ecobiciViajes = v || [];
  // Maintain compatibility with animation.js expecting a global
  window.ecobiciViajes = state.ecobiciViajes;
}

export function setTimtValidations(rows) {
  state.timtValidations = rows || [];
}

export function registerChart(key, chartInstance) {
  const existing = state.charts.get(key);
  if (existing && typeof existing.destroy === 'function') {
    try { existing.destroy(); } catch {}
  }
  state.charts.set(key, chartInstance);
}
