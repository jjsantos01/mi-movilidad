import { mountChart } from './common.js';
import { registerChart } from '../state.js';

export function createBarChartByMomentoDia(viajes) {
  const momentoData = viajes.reduce((acc, viaje) => {
    const key = `${viaje.organismo}+${viaje.momento_dia}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const organismos = [...new Set(viajes.map(v => v.organismo))];
  const momentos = ['Mañana', 'Tarde', 'Noche'];
  const seriesData = momentos.map(momento => ({
    name: momento,
    data: organismos.map(organismo => momentoData[`${organismo}+${momento}`] || 0)
  }));

  const options = {
    series: seriesData,
    chart: { type: 'bar', height: 350, stacked: false },
    plotOptions: { bar: { horizontal: false } },
    xaxis: { categories: organismos, title: { text: 'Sistema de Transporte' } },
    yaxis: { title: { text: 'Número de Viajes' } },
    legend: { position: 'top' },
    fill: { opacity: 1 },
    title: { text: 'Total de viajes por sistema y momento del día', align: 'center' },
    tooltip: { y: { formatter: val => `${val} viajes` } },
  };
  return mountChart('momento', 'barChartMomentoDia', options, registerChart);
}

