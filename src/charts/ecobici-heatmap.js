import { getEcobiciODViajes, getEcobiciODMeanTime } from '../data/ecobici.js';
import { mountChart } from './common.js';
import { registerChart } from '../state.js';

export function createEcobiciHeatmap(inicioViaje, finViaje, tipo = 'viajes') {
  const viajes = getEcobiciODViajes(inicioViaje, finViaje);
  const processedData = tipo === 'viajes' ? viajes : getEcobiciODMeanTime(inicioViaje, finViaje);
  const estaciones = [...new Set([...processedData.map(d => d.x), ...processedData.map(d => d.y)])];

  const viajeCounts = {};
  viajes.forEach(({ x: origen, y: destino, value }) => {
    viajeCounts[origen] = (viajeCounts[origen] || 0) + value;
    viajeCounts[destino] = (viajeCounts[destino] || 0) + value;
  });
  const estacionesPopulares = estaciones.filter(estacion => (viajeCounts[estacion] || 0) >= 2);

  const seriesMap = estacionesPopulares.map(origen => ({ name: origen, data: [] }));
  const byName = new Map(seriesMap.map(s => [s.name, s]));
  processedData.forEach(({ x: origen, y: destino, value }) => {
    if (byName.has(origen) && estacionesPopulares.includes(destino)) {
      byName.get(origen).data.push({ x: destino, y: value });
    }
  });
  estacionesPopulares.forEach(origen => {
    const s = byName.get(origen);
    s.data.sort((a, b) => estacionesPopulares.indexOf(a.x) - estacionesPopulares.indexOf(b.x));
  });

  const series = Array.from(byName.values());
  const prefixTitle = tipo === 'viajes' ? 'Viajes' : 'Tiempo promedio (min)';
  const prefixUnit = tipo === 'viajes' ? 'viajes' : 'min';

  const options = {
    series,
    chart: { type: 'heatmap', height: 420 },
    dataLabels: { enabled: true },
    colors: ['#008FFB'],
    title: { text: `${prefixTitle} entre tus rutas más comunes de Ecobici` },
    xaxis: { categories: estacionesPopulares, labels: { rotate: -45, rotateAlways: true, maxHeight: 60 } },
    yaxis: { categories: estacionesPopulares },
    tooltip: { y: { formatter: v => `${v} ${prefixUnit}` } },
  };

  const elementId = `ecobici-${tipo}`;
  return mountChart(`ecobici-${tipo}`, elementId, options, registerChart);
}

