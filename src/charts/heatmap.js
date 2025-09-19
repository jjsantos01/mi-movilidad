import { mountChart } from './common.js';
import { registerChart } from '../state.js';

export function createHeatmap(viajes, selectedOrganismo = 'Todos') {
  const heatmapElement = document.getElementById('heatmapChart');
  if (!heatmapElement) return null;
  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const momentosDia = ['Mañana', 'Tarde', 'Noche'];

  const filtered = selectedOrganismo === 'Todos' ? viajes : viajes.filter(v => v.organismo === selectedOrganismo);
  const counts = new Map();
  filtered.forEach(v => {
    const key = `${v.dayOfWeek}__${v.momento_dia}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const series = diasSemana.map(dia => ({
    name: dia,
    data: momentosDia.map(momento => ({ x: momento, y: counts.get(`${dia}__${momento}`) || 0 }))
  }));

  const options = {
    series,
    chart: { type: 'heatmap', height: 350 },
    dataLabels: { enabled: true },
    colors: ['#008FFB'],
    title: { text: 'Viajes por día de la semana y momento' },
    xaxis: { categories: momentosDia },
    yaxis: { categories: diasSemana.reverse() },
    tooltip: { y: { formatter: v => `${v} viajes` } },
  };

  return mountChart('heatmap', 'heatmapChart', options, registerChart);
}
