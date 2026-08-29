import { colorPalette } from '../config/constants.js';

export function classifySTESubsystem(linea) {
  const s = String(linea || '').trim().toUpperCase();
  if (s.includes('TROLEB')) return 'Trolebús';
  if (s.includes('TREN LIGERO') || s.startsWith('TL')) return 'Tren Ligero';
  if (s.includes('TIMT')) return 'TIMT (Tren Interurbano)';
  return 'Otros STE';
}

export function getSTESubsystemBreakdown(steTrips) {
  const counts = {
    'Trolebús': 0,
    'Tren Ligero': 0,
    'TIMT (Tren Interurbano)': 0,
    'Otros STE': 0,
  };

  (steTrips || []).forEach(v => {
    const sub = classifySTESubsystem(v.linea);
    counts[sub] = (counts[sub] || 0) + 1;
  });

  return counts;
}

export function getSTEStats(data) {
  const dataset = Array.isArray(data) ? data : [];
  const totalViajes = dataset.length;

  let viajesTrolebus = 0;
  let viajesTrenLigero = 0;
  let viajesTIMT = 0;
  let viajesOtros = 0;

  dataset.forEach(viaje => {
    const sub = classifySTESubsystem(viaje.linea);
    if (sub === 'Trolebús') viajesTrolebus++;
    else if (sub === 'Tren Ligero') viajesTrenLigero++;
    else if (sub === 'TIMT (Tren Interurbano)') viajesTIMT++;
    else viajesOtros++;
  });

  const fechasUnicas = new Set(dataset.map(viaje => (viaje.fecha || '').split(' ')[0]).filter(Boolean));

  const gastoTotal = dataset.reduce((total, viaje) => {
    const rawMonto = viaje?.monto ?? 0;
    const montoNumero = typeof rawMonto === 'number'
      ? rawMonto
      : parseFloat(String(rawMonto).replace(',', '.'));
    if (!Number.isFinite(montoNumero)) return total;
    return total + montoNumero;
  }, 0);

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText('totalViajesSTE', totalViajes.toLocaleString());
  setText('viajesTrolebusSTE', viajesTrolebus.toLocaleString());
  setText('viajesTrenLigeroSTE', viajesTrenLigero.toLocaleString());
  setText('diasUsoSTE', fechasUnicas.size.toLocaleString());
  setText('montoGastadoSTE', `$${gastoTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);

  // Card colorization
  const container = document.getElementById('STEStatsContainer');
  if (container) {
    const baseColor = colorPalette['STE'] || 'rgba(0, 87, 184, 0.8)';
    const withAlpha = baseColor.replace(/[\d\.]+\)$/g, '0.5)');
    container.querySelectorAll('p').forEach(p => {
      p.parentElement?.style?.setProperty('background-color', withAlpha);
    });
  }
}
