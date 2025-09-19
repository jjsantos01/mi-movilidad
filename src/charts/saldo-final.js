import { mountChart } from './common.js';
import { registerChart } from '../state.js';
import { parseFechaHora } from '../utils/date.js';

export function createSaldoFinalChart(data) {
  const excludedOps = new Set(['70-INICIO DE VIAJE', '71-FIN DE VIAJE']);
  const rows = (data || [])
    .filter(item => item && item.fecha && item.saldo_final !== undefined)
    .filter(item => !excludedOps.has(String(item.operacion || '').toUpperCase()));

  const parsed = rows.map(item => {
    const x = parseFechaHora(String(item.fecha)); // preserves time within the day
    const y = parseFloat(item.saldo_final);
    return { x, y: isNaN(y) ? null : y };
  });

  const sorted = parsed
    .filter(d => d.y !== null && d.x instanceof Date && !isNaN(d.x))
    .sort((a, b) => a.x - b.x);

  // Keep only points where saldo actually changed
  const dedup = [];
  for (const p of sorted) {
    if (dedup.length === 0 || dedup[dedup.length - 1].y !== p.y) {
      dedup.push(p);
    }
  }
  const options = {
    series: [{ name: 'Saldo final', data: dedup }],
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
