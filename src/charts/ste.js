import { mountChart } from './common.js';
import { registerChart } from '../state.js';
import { getSTESubsystemBreakdown } from '../data/ste.js';

const SUBSYSTEM_COLORS = {
  'Trolebús': '#0057B8',
  'Tren Ligero': '#00A859',
  'TIMT (Tren Interurbano)': '#7D2F2B',
  'Otros STE': '#888888',
};

export function createSTESubsystemsChart(steTrips) {
  const breakdown = getSTESubsystemBreakdown(steTrips);
  const labels = Object.keys(breakdown).filter(k => breakdown[k] > 0);
  const series = labels.map(k => breakdown[k]);
  const colors = labels.map(k => SUBSYSTEM_COLORS[k] || '#0057B8');

  const options = {
    series,
    chart: { type: 'donut', height: 350 },
    labels,
    colors,
    title: { text: 'Distribución de viajes por subsistema de STE', align: 'center' },
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '50%' } } },
    dataLabels: { enabled: true, formatter: (val, opts) => opts.w.config.series[opts.seriesIndex] },
    tooltip: { y: { formatter: v => `${v} viajes` } },
    responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }],
  };

  return mountChart('steSubsystems', 'steSubsystemsChart', options, registerChart);
}

export function createSTELinesChart(steTrips) {
  const lineaCounts = (steTrips || []).reduce((acc, v) => {
    const name = String(v.linea || 'Sin Línea').trim();
    if (name) acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const sortedLines = Object.entries(lineaCounts).sort((a, b) => b[1] - a[1]);
  const labels = sortedLines.map(([linea]) => linea);
  const data = sortedLines.map(([, count]) => count);

  const colors = labels.map(linea => {
    const s = linea.toUpperCase();
    if (s.includes('TROLEB')) return '#0057B8';
    if (s.includes('TREN LIGERO') || s.startsWith('TL')) return '#00A859';
    if (s.includes('TIMT')) return '#7D2F2B';
    return '#888888';
  });

  const options = {
    series: [{ name: 'Viajes', data }],
    chart: { type: 'bar', height: Math.max(300, labels.length * 35) },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 4,
      }
    },
    colors,
    dataLabels: { enabled: true },
    legend: { show: false },
    title: { text: 'Viajes por línea de STE', align: 'center' },
    xaxis: { categories: labels, title: { text: 'Número de viajes' } },
    tooltip: { y: { formatter: v => `${v} viajes` } },
  };

  return mountChart('steLines', 'steLinesChart', options, registerChart);
}
