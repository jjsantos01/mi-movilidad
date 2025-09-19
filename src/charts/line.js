import { colorPalette } from '../config/constants.js';
import { mountChart } from './common.js';
import { registerChart } from '../state.js';

export function createLineChart(viajes) {
  const organismoDates = viajes.reduce((acc, viaje) => {
    const date = new Date(viaje.fecha.split(' ')[0].split('-').reverse().join('-'));
    const organismo = viaje.organismo;
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const key = `${organismo}+${monthYear}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const labels = [];
  const dataValues = {};
  Object.keys(organismoDates).forEach(key => {
    const [organismo, monthYear] = key.split('+');
    if (!labels.includes(monthYear)) labels.push(monthYear);
    if (!dataValues[organismo]) dataValues[organismo] = [];
    dataValues[organismo].push({ date: monthYear, value: organismoDates[key] });
  });
  labels.sort((a, b) => new Date(a) - new Date(b));

  const series = Object.keys(dataValues).map(organismo => ({
    name: organismo,
    data: labels.map(monthYear => {
      const found = dataValues[organismo].find(d => d.date === monthYear);
      return found ? found.value : 0;
    }),
    color: colorPalette[organismo]
  }));

  const options = {
    series,
    colors: series.map(s => s.color),
    chart: { type: 'line', height: 350, zoom: { enabled: false } },
    title: { text: 'Total de Viajes Mensuales por sistema de transporte', align: 'center' },
    xaxis: { categories: labels, title: { text: 'Mes y Año' } },
    yaxis: { title: { text: 'Número de Viajes' } },
    stroke: { curve: 'smooth' },
    markers: { size: 5 },
    tooltip: { shared: true, intersect: false },
  };
  return mountChart('line', 'lineChart', options, registerChart);
}

