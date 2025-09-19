import { colorPalette } from '../config/constants.js';
import { mountChart } from './common.js';
import { registerChart } from '../state.js';

function procesarViajesPorHoraYOrganismo(viajes) {
  const organismos = [...new Set(viajes.map(v => v.organismo))];
  const viajesPorHoraYOrganismo = organismos.reduce((acc, org) => { acc[org] = Array(24).fill(0); return acc; }, {});
  viajes.forEach(viaje => { viajesPorHoraYOrganismo[viaje.organismo][viaje.hora] += 1; });
  return { organismos, viajesPorHoraYOrganismo };
}

export function crearGraficoViajesPorHoraYOrganismo(viajes) {
  const { organismos, viajesPorHoraYOrganismo } = procesarViajesPorHoraYOrganismo(viajes);
  const series = organismos.map(org => ({ name: org, data: viajesPorHoraYOrganismo[org], color: colorPalette[org] }));
  const options = {
    series,
    colors: series.map(s => s.color),
    chart: { type: 'bar', height: 350, stacked: true, zoom: { enabled: false } },
    plotOptions: { bar: { horizontal: false } },
    title: { text: 'Distribución de viajes por hora y sistema', align: 'center' },
    xaxis: { categories: Array.from({ length: 24 }, (_, i) => i), title: { text: 'Hora del día' } },
    yaxis: { title: { text: 'Número de viajes' } },
    dataLabels: { enabled: true },
    tooltip: { shared: true, intersect: false, y: { formatter: v => `${v} viajes` } },
    };
  return mountChart('viajesPorHora', 'viajesPorHora', options, registerChart);
}
