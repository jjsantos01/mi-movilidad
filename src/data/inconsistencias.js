import { parseFechaHora } from '../utils/date.js';

export const inconsistentKeys = new Set();

export function detectInconsistencias(data) {
  if (!data || data.length === 0) return [];
  inconsistentKeys.clear();

  const sorted = [...data].sort((a, b) => parseFechaHora(a.fecha) - parseFechaHora(b.fecha));
  const excludedOps = new Set(['70-INICIO DE VIAJE', '71-FIN DE VIAJE']);
  const filtered = sorted.filter(item => !excludedOps.has((item.operacion || '').toUpperCase()));

  const inconsistencias = [];
  for (let i = 1; i < filtered.length; i++) {
    const prev = filtered[i - 1];
    const curr = filtered[i];

    const saldoPrev = parseFloat(prev.saldo_final) || 0;
    const monto = parseFloat(curr.monto) || 0;
    const esRecarga = (curr.operacion || '').toUpperCase().indexOf('RECARGA') !== -1;
    const esperado = esRecarga ? saldoPrev + monto : saldoPrev - monto;
    const actual = parseFloat(curr.saldo_final) || 0;

    if (Math.abs(esperado - actual) > 0.001) {
      const original = data.find(d => d.numero === curr.numero && d.fecha === curr.fecha) || curr;
      original._inconsistente = true;
      original._saldo_inicial = saldoPrev;
      original._esperado = esperado;

      const key = `${original.numero}__${original.fecha}`;
      inconsistentKeys.add(key);
      inconsistencias.push({
        numero: curr.numero,
        fecha: curr.fecha,
        monto: curr.monto,
        saldo_inicial: saldoPrev,
        saldo_final: curr.saldo_final,
        esperado
      });
    }
  }
  return inconsistencias;
}

export function renderWarning(inconsistencias) {
  const wc = document.getElementById('warningContainer');
  if (!wc) return;
  const n = inconsistencias.length;
  let html = `<div class="warning-box"><h4>Se detectó ${n} transacci${n === 1 ? 'ón' : 'ones'} con valores cobrados inconsistentes:</h4>`;
  html += '<ul class="warning-list">';
  inconsistencias.forEach(item => {
    html += `<li>número: ${item.numero}, fecha: ${item.fecha}, monto cobrado: ${item.monto}, saldo inicial: ${item.saldo_inicial}, saldo final: ${item.saldo_final}</li>`;
  });
  html += '</ul></div>';
  wc.innerHTML = html;
}

