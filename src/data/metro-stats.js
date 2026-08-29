import { colorPalette } from '../config/constants.js';

export function getMetroStats(data, organismo = 'STC', options = {}) {
  const dataset = Array.isArray(data) ? data : [];
  const stationExtractor = typeof options.getStations === 'function'
    ? options.getStations
    : viaje => [viaje.estacion];

  const totalViajes = dataset.length;

  const estacionesUnicas = new Set();
  dataset.forEach(viaje => {
    const estaciones = stationExtractor(viaje) || [];
    estaciones
      .map(nombre => (nombre || '').trim())
      .filter(Boolean)
      .forEach(nombre => estacionesUnicas.add(nombre));
  });

  const fechasUnicas = new Set(dataset.map(viaje => (viaje.fecha || '').split(' ')[0]).filter(Boolean));
  const gastoTotal = dataset.reduce((total, viaje) => {
    const rawMonto = viaje?.monto ?? 0;
    const montoNumero = typeof rawMonto === 'number'
      ? rawMonto
      : parseFloat(String(rawMonto).replace(',', '.'));
    const op = String(viaje?.operacion || '').trim().toUpperCase();
    if (op && op !== '03-VALIDACION') return total;
    return total + montoNumero;
  }, 0);

  // Element/section prefix mapping
  let elementId = options.elementId || 'Metro';
  if (!options.elementId) {
    if (organismo === 'METROBÚS') elementId = 'Metrobus';
    else elementId = 'Metro';
  }

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText(`totalViajes${elementId}`, totalViajes.toLocaleString());
  setText(`estacionesVisitadas${elementId}`, estacionesUnicas.size.toLocaleString());
  setText(`diasUso${elementId}`, fechasUnicas.size.toLocaleString());
  setText(`montoGastado${elementId}`, `$${gastoTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);

  // Card colorization
  const container = document.getElementById(`${elementId}StatsContainer`);
  if (container) {
    const baseColor = options.color || colorPalette[organismo] || 'rgba(0,0,0,0.2)';
    const withAlpha = baseColor.replace(/[\d\.]+\)$/g, '0.5)');
    container.querySelectorAll('p').forEach(p => {
      p.parentElement?.style?.setProperty('background-color', withAlpha);
    });
  }
}
