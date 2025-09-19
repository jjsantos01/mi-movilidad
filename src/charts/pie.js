import { getColorForOrganismo, mountChart } from './common.js';
import { registerChart } from '../state.js';

export function createPieChart(viajes) {
  const organismoCounts = viajes.reduce((acc, v) => {
    acc[v.organismo] = (acc[v.organismo] || 0) + 1;
    return acc;
  }, {});
  const labels = Object.keys(organismoCounts);
  const series = labels.map(k => organismoCounts[k]);
  const options = {
    series,
    chart: { type: 'donut', height: 380 },
    labels,
    colors: labels.map(getColorForOrganismo),
    title: { text: 'Número de Viajes por sistema de transporte', align: 'center' },
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '50%' } } },
    dataLabels: { enabled: true, formatter: (val, opts) => opts.w.config.series[opts.seriesIndex] },
    tooltip: { y: { formatter: v => `${v} viajes` } },
    responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }]
  };
  return mountChart('pie', 'pieChart', options, registerChart);
}

