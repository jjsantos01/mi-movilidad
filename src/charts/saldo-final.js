import { mountChart } from './common.js';
import { registerChart } from '../state.js';

export function createSaldoFinalChart(data) {
  const parsed = (data || [])
    .filter(item => item && item.fecha)
    .map(item => {
      const dateStr = String(item.fecha).split(' ')[0] || '';
      const x = new Date(dateStr.split('-').reverse().join('-'));
      const y = parseFloat(item.saldo_final);
      return { x, y: isNaN(y) ? null : y };
    });
  const sortedData = parsed.filter(d => d.y !== null && d.x instanceof Date && !isNaN(d.x)).sort((a, b) => a.x - b.x);
  const options = {
    series: [{ name: 'Saldo final', data: sortedData }],
    chart: { type: 'line', height: 350, zoom: { enabled: false } },
    title: { text: 'Evolución de saldo final', align: 'center' },
    xaxis: { type: 'datetime' },
    yaxis: { title: { text: 'Saldo ($)' } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    tooltip: { y: { formatter: v => `$${v}` } },
  };
  return mountChart('saldo', 'saldoFinalChart', options, registerChart);
}
