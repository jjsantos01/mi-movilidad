import { mountChart } from './common.js';
import { registerChart } from '../state.js';
import { parseFechaHora } from '../utils/date.js';

function startOfMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Semana de lunes a domingo
function startOfISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Domingo, 1=Lunes, ... 6=Sábado
  const diffToMonday = (day + 6) % 7; // 0 si ya es lunes
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

function aggregateGasto(data, periodo) {
  const isSemana = periodo === 'semana';
  const excluded = new Set(['00-RECARGA']);
  const map = new Map(); // key(ms) -> total

  for (const item of data || []) {
    if (!item || !item.fecha) continue;
    const op = String(item.operacion || '').toUpperCase();
    if (excluded.has(op)) continue;
    const monto = parseFloat(item.monto);
    if (!isFinite(monto)) continue;

    const dt = parseFechaHora(String(item.fecha));
    if (!(dt instanceof Date) || isNaN(dt)) continue;
    const bucketDate = isSemana ? startOfISOWeek(dt) : startOfMonth(dt);
    const key = bucketDate.getTime();
    map.set(key, (map.get(key) || 0) + monto);
  }

  const pts = Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([ms, total]) => {
      const base = new Date(Number(ms));
      const x = isSemana ? base : endOfMonth(base);
      return { x, y: total };
    });
  return pts;
}

export function createGastoTotalChart(data, periodo = 'mes') {
  const serie = aggregateGasto(data, periodo);
  const titulo = periodo === 'semana' ? 'Gasto total por semana' : 'Gasto total por mes';

  const options = {
    series: [{ name: 'Gasto', data: serie }],
    chart: { type: 'line', height: 350, zoom: { enabled: false } },
    title: { text: titulo, align: 'center' },
    xaxis: { type: 'datetime' },
    yaxis: { title: { text: 'Gasto ($)' } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    tooltip: {
      x: {
        formatter: (val) => {
          if (periodo === 'semana') {
            const start = new Date(val);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            const f = (d) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
            return `${f(start)} a ${f(end)}`;
          }
          // Para mes, mostrar la fecha exacta (fin de mes)
          const d = new Date(val);
          return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
        }
      },
      y: { formatter: v => `$${v.toFixed ? v.toFixed(2) : v}` }
    },
  };
  return mountChart('gasto-total', 'gastoTotalChart', options, registerChart);
}
