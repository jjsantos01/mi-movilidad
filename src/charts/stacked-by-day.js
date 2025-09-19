import { colorPalette } from '../config/constants.js';
import { mountChart } from './common.js';
import { registerChart } from '../state.js';

export function createStackedBarChart(viajes) {
  const organismoDays = viajes.reduce((acc, viaje) => {
    const key = `${viaje.organismo}+${viaje.dayOfWeek}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const labels = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const dataValues = {};
  Object.keys(organismoDays).forEach(key => {
    const [organismo, dayOfWeek] = key.split('+');
    if (!dataValues[organismo]) dataValues[organismo] = [];
    dataValues[organismo].push({ day: dayOfWeek, value: organismoDays[key] });
  });

  const series = Object.keys(dataValues).map(organismo => ({
    name: organismo,
    data: labels.map(day => {
      const found = dataValues[organismo].find(d => d.day === day);
      return found ? found.value : 0;
    }),
    color: colorPalette[organismo]
  }));

  const options = {
    series,
    colors: series.map(s => s.color),
    chart: { type: 'bar', height: 350, stacked: true },
    plotOptions: { bar: { horizontal: false } },
    xaxis: { categories: labels, title: { text: 'Día de la semana' } },
    yaxis: { title: { text: 'Número de viajes' } },
    title: { text: 'Total de viajes por sistema y día de la semana', align: 'center' },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: val => `${val} viajes` } },
    legend: { position: 'top', horizontalAlign: 'left' },
  };
  return mountChart('stacked', 'stackedBarChart', options, registerChart);
}

