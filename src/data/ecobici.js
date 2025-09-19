import { parseDateTime } from '../utils/date.js';
import { colorPalette } from '../config/constants.js';

export function matchInicioFinViaje(inicioViaje, finViaje) {
  return (inicioViaje || [])
    .map(inicio => {
      const fin = (finViaje || []).find(f => f.numero === inicio.numero + 1);
      if (!fin) return null;
      const fechaInicio = parseDateTime(inicio.fecha);
      const fechaFin = parseDateTime(fin.fecha);
      const duracion = Math.round((fechaFin - fechaInicio) / 60000);
      return {
        estacionInicio: inicio.estacion,
        estacionFin: fin.estacion,
        fechaInicio,
        fechaFin,
        duracion,
      };
    })
    .filter(Boolean);
}

export function getEcobiciODViajes(inicioViaje, finViaje) {
  const viajesMap = new Map();
  (inicioViaje || []).forEach(inicio => {
    const fin = (finViaje || []).find(f => f.numero === inicio.numero + 1);
    if (!fin) return;
    const key = `${inicio.estacion}__${fin.estacion}`;
    viajesMap.set(key, (viajesMap.get(key) || 0) + 1);
  });
  return Array.from(viajesMap.entries()).map(([k, v]) => {
    const [x, y] = k.split('__');
    return { x, y, value: v };
  });
}

export function getEcobiciODMeanTime(inicioViaje, finViaje) {
  const viajes = matchInicioFinViaje(inicioViaje, finViaje);
  const byRoute = new Map();
  viajes.forEach(v => {
    const key = `${v.estacionInicio}__${v.estacionFin}`;
    const prev = byRoute.get(key) || { sum: 0, n: 0 };
    prev.sum += v.duracion;
    prev.n += 1;
    byRoute.set(key, prev);
  });
  return Array.from(byRoute.entries()).map(([k, { sum, n }]) => {
    const [x, y] = k.split('__');
    return { x, y, value: Math.round(sum / Math.max(n, 1)) };
  });
}

export function getEcobiciStats(inicioViaje, finViaje) {
  const viajes = matchInicioFinViaje(inicioViaje, finViaje);
  const totalViajes = viajes.length;
  const tiempoTotal = viajes.reduce((acc, v) => acc + (v.duracion || 0), 0);
  const estacionesVisitadas = new Set();
  viajes.forEach(v => { estacionesVisitadas.add(v.estacionInicio); estacionesVisitadas.add(v.estacionFin); });
  const tiempoPromedio = totalViajes ? Math.round(tiempoTotal / totalViajes) : 0;

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val.toLocaleString(); };
  setText('totalViajesEcobici', totalViajes);
  setText('estacionesVisitadas', estacionesVisitadas.size);
  setText('totalTiempoEcobici', `${tiempoTotal} min`);
  setText('tiempoPromedioEcobici', `${tiempoPromedio} min`);

  // Colorize Ecobici stat cards similar to previous behavior
  const container = document.getElementById('ecobiciStatsContainer');
  if (container) {
    const base = colorPalette['ECOBICI'] || 'rgba(0, 154, 68, 0.8)';
    const withAlpha = base.replace(/[\d\.]+\)$/g, '0.5)');
    container.querySelectorAll('p').forEach(p => {
      p.parentElement?.style?.setProperty('background-color', withAlpha);
    });
  }
}
