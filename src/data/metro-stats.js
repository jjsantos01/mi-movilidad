import { colorPalette } from '../config/constants.js';

export function getMetroStats(data, organismo = 'STC', options = {}) {
  const totalViajes = (data || []).length;
  const estacionesUnicas = new Set((data || []).map(viaje => viaje.estacion).filter(Boolean));
  const fechasUnicas = new Set((data || []).map(viaje => (viaje.fecha || '').split(' ')[0]).filter(Boolean));
  const gastoTotal = (data || []).reduce((total, viaje) => {
    if (viaje.operacion === '03-VALIDACION') {
      const m = parseFloat(viaje.monto);
      return total + (isNaN(m) ? 0 : m);
    }
    return total;
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
